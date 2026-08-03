import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dns from 'node:dns'
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

// Render et autres PaaS n'ont souvent pas de routage IPv6 vers Supabase.
dns.setDefaultResultOrder('ipv4first')

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../.env') })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL est manquant.\n'
    + '→ Renseignez DATABASE_URL avec la connection string Postgres Supabase\n'
    + '  (Project Settings > Database > Connection string > Transaction pooler, port 6543)',
  )
}

if (databaseUrl.includes(':5432/') || databaseUrl.includes(':5432?')) {
  throw new Error(
    'DATABASE_URL utilise le port 5432 (connexion directe Supabase).\n'
    + 'Sur Render, cela échoue (IPv6 inaccessible).\n'
    + '→ Utilisez le Transaction pooler : port 6543\n'
    + '  Supabase > Project Settings > Database > Connection string > Transaction pooler > URI',
  )
}

// Le pooler Supabase (port 6543) nécessite SSL.
export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
})
