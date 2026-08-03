import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../.env') })

/**
 * Configuration R2 pour le client S3.
 *
 * Requis :
 * - R2_ACCESS_KEY_ID      → clé S3 (créée via R2 > Manage R2 API Tokens)
 * - R2_SECRET_ACCESS_KEY  → secret S3 associé
 * - R2_BUCKET_NAME        → nom du bucket
 * - R2_PUBLIC_URL         → URL publique r2.dev du bucket
 * - R2_ACCOUNT_ID  OU  R2_ENDPOINT  → endpoint S3 (un des deux)
 *
 * Non utilisé ici :
 * - "Token Value" Cloudflare → API REST Cloudflare, pas le SDK S3
 */
export function getR2Config() {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucketName = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')

  const endpoint = process.env.R2_ENDPOINT
    ?? (process.env.R2_ACCOUNT_ID
      ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined)

  return { accessKeyId, secretAccessKey, bucketName, publicUrl, endpoint }
}

export function assertR2Configured() {
  const cfg = getR2Config()
  const missing = []

  if (!cfg.accessKeyId) missing.push('R2_ACCESS_KEY_ID')
  if (!cfg.secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY')
  if (!cfg.bucketName) missing.push('R2_BUCKET_NAME')
  if (!cfg.publicUrl) missing.push('R2_PUBLIC_URL')
  if (!cfg.endpoint) missing.push('R2_ACCOUNT_ID ou R2_ENDPOINT')

  if (missing.length > 0) {
    throw new Error(
      `Configuration R2 incomplète (${missing.join(', ')}).\n`
      + 'Créez un token R2 avec permissions Object Read & Write, '
      + 'puis renseignez Access Key ID + Secret Access Key dans .env',
    )
  }

  return cfg
}

let _client = null

export function getR2Client() {
  const cfg = assertR2Configured()
  if (!_client) {
    _client = new S3Client({
      region: 'auto',
      endpoint: cfg.endpoint,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    })
  }
  return _client
}

export function buildPublicUrl(key) {
  const { publicUrl } = assertR2Configured()
  return `${publicUrl}/${key}`
}
