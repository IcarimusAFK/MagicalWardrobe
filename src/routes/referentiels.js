import { Tag, TypeVetement } from '../models/index.js';

export default async function referentielRoutes(fastify) {
  // GET /tags
  fastify.get('/tags', async () => {
    return Tag.findAll({ order: [['label', 'ASC']] });
  });

  // POST /tags — pour créer un nouveau tag à la volée depuis le front
  fastify.post('/tags', async (request) => {
    const { label } = request.body;
    const [tag] = await Tag.findOrCreate({ where: { label } });
    return tag;
  });

  // GET /types
  fastify.get('/types', async () => {
    return TypeVetement.findAll({ order: [['label', 'ASC']] });
  });
}
