import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../.env') })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL est manquant.\n'
    + '→ Copiez .env.example vers .env\n'
    + '→ Renseignez DATABASE_URL avec la connection string Postgres Supabase\n'
    + '  (Project Settings > Database > Connection string > Transaction pooler, port 6543)',
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
