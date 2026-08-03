import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import 'dotenv/config';

import { sequelize } from './models/index.js';
import vetementRoutes from './routes/vetements.js';
import referentielRoutes from './routes/referentiels.js';
import uploadRoutes from './routes/upload.js';
import outfitRoutes from './routes/outfits.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || '*',
});

await fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Mo max par photo
  },
});

await fastify.register(vetementRoutes);
await fastify.register(referentielRoutes);
await fastify.register(uploadRoutes);
await fastify.register(outfitRoutes);

fastify.get('/health', async () => ({ status: 'ok', app: 'Magical Wardrobe API' }));

const start = async () => {
  try {
    await sequelize.authenticate();
    fastify.log.info('Magical Wardrobe API — connexion Supabase OK');

    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
