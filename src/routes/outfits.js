import { PickedOutfit } from '../models/index.js';

export default async function outfitRoutes(fastify) {
  // GET /outfits
  fastify.get('/outfits', async () => {
    return PickedOutfit.findAll({ order: [['date', 'DESC'], ['created_at', 'DESC']] });
  });

  // POST /outfits
  // Body: { date, id_haut, id_bas, id_ceinture, id_chaussure, id_veste }
  fastify.post('/outfits', async (request) => {
    const { date, id_haut, id_bas, id_ceinture, id_chaussure, id_veste } = request.body;
    return PickedOutfit.create({
      date,
      id_haut: id_haut ?? null,
      id_bas: id_bas ?? null,
      id_ceinture: id_ceinture ?? null,
      id_chaussure: id_chaussure ?? null,
      id_veste: id_veste ?? null,
    });
  });
}
