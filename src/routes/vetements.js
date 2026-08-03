import { Op, fn, col } from 'sequelize';
import { Vetement, Tag, TypeVetement, sequelize } from '../models/index.js';

export default async function vetementRoutes(fastify) {
  // GET /vetements?tags=1,2&type=1
  // Filtrage optionnel par tags (logique ET : doit avoir TOUS les tags donnés)
  // et par type de vêtement.
  fastify.get('/vetements', async (request) => {
    const { tags, type } = request.query;
    const tagIds = tags ? tags.split(',').map(Number) : null;

    const where = {};
    if (type) where.id_type = Number(type);

    if (tagIds && tagIds.length > 0) {
      // Sous-requête : vêtements dont le nombre de tags matchés = nombre de tags demandés
      const matching = await sequelize.query(
        `
        SELECT id_vetement FROM asso_vetement_tag
        WHERE id_tag IN (:tagIds)
        GROUP BY id_vetement
        HAVING COUNT(DISTINCT id_tag) = :tagCount
        `,
        {
          replacements: { tagIds, tagCount: tagIds.length },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      const matchingIds = matching.map((r) => r.id_vetement);
      where.id_vetement = { [Op.in]: matchingIds.length > 0 ? matchingIds : [-1] };
    }

    return Vetement.findAll({
      where,
      include: [
        { model: Tag, through: { attributes: [] } },
        { model: TypeVetement },
      ],
      order: [['created_at', 'DESC']],
    });
  });

  // GET /vetements/:id
  fastify.get('/vetements/:id', async (request, reply) => {
    const vetement = await Vetement.findByPk(request.params.id, {
      include: [
        { model: Tag, through: { attributes: [] } },
        { model: TypeVetement },
      ],
    });
    if (!vetement) return reply.code(404).send({ error: 'Vêtement introuvable' });
    return vetement;
  });

  // POST /vetements
  // Body: { id_type, label, description, pic_path, tagIds: [1,2,3] }
  fastify.post('/vetements', async (request) => {
    const { id_type, label, description, pic_path, tagIds = [] } = request.body;

    const vetement = await Vetement.create({ id_type, label, description, pic_path });

    if (tagIds.length > 0) {
      const tags = await Tag.findAll({ where: { id_tag: { [Op.in]: tagIds } } });
      await vetement.setTags(tags);
    }

    return Vetement.findByPk(vetement.id_vetement, {
      include: [{ model: Tag, through: { attributes: [] } }, { model: TypeVetement }],
    });
  });

  // PUT /vetements/:id
  fastify.put('/vetements/:id', async (request, reply) => {
    const vetement = await Vetement.findByPk(request.params.id);
    if (!vetement) return reply.code(404).send({ error: 'Vêtement introuvable' });

    const { id_type, label, description, pic_path, tagIds } = request.body;
    await vetement.update({ id_type, label, description, pic_path });

    if (tagIds) {
      const tags = await Tag.findAll({ where: { id_tag: { [Op.in]: tagIds } } });
      await vetement.setTags(tags);
    }

    return Vetement.findByPk(vetement.id_vetement, {
      include: [{ model: Tag, through: { attributes: [] } }, { model: TypeVetement }],
    });
  });

  // DELETE /vetements/:id
  fastify.delete('/vetements/:id', async (request, reply) => {
    const vetement = await Vetement.findByPk(request.params.id);
    if (!vetement) return reply.code(404).send({ error: 'Vêtement introuvable' });
    await vetement.destroy();
    return { success: true };
  });
}
