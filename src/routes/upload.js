import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'
import { buildPublicUrl, getR2Client, getR2Config, assertR2Configured } from '../plugins/r2Client.js'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const EXTENSION_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

function resolveExtension(fileName, fileType) {
  return EXTENSION_BY_TYPE[fileType]
    ?? fileName.split('.').pop()?.toLowerCase()
    ?? 'jpg'
}

async function uploadBufferToR2({ buffer, fileType, fileName }) {
  const cfg = assertR2Configured()
  const extension = resolveExtension(fileName, fileType)
  const key = `vetements/${randomUUID()}.${extension}`

  await getR2Client().send(new PutObjectCommand({
    Bucket: cfg.bucketName,
    Key: key,
    Body: buffer,
    ContentType: fileType,
  }))

  return { key, publicUrl: buildPublicUrl(key) }
}

export default async function uploadRoutes(fastify) {
  /**
   * POST /upload
   * multipart/form-data — champ "photo"
   *
   * Upload via l'API (évite les problèmes CORS navigateur → R2).
   */
  fastify.post('/upload', async (request, reply) => {
    try {
      const data = await request.file()

      if (!data) {
        return reply.code(400).send({ error: 'Fichier photo requis (champ "photo")' })
      }

      const fileType = data.mimetype
      if (!ALLOWED_TYPES.has(fileType)) {
        return reply.code(400).send({
          error: 'Type de fichier non supporté. Utilisez JPEG, PNG, WebP ou GIF.',
        })
      }

      const buffer = await data.toBuffer()
      const result = await uploadBufferToR2({
        buffer,
        fileType,
        fileName: data.filename,
      })

      return result
    }
    catch (err) {
      fastify.log.error(err)
      return reply.code(503).send({
        error: err instanceof Error ? err.message : 'Upload R2 indisponible',
      })
    }
  })

  /**
   * POST /upload/presign
   * Alternative : URL présignée pour upload direct navigateur → R2
   * (nécessite une policy CORS configurée sur le bucket)
   */
  fastify.post('/upload/presign', async (request, reply) => {
    try {
      const { fileName, fileType } = request.body ?? {}

      if (!fileName || !fileType) {
        return reply.code(400).send({ error: 'fileName et fileType sont requis' })
      }

      if (!ALLOWED_TYPES.has(fileType)) {
        return reply.code(400).send({
          error: 'Type de fichier non supporté. Utilisez JPEG, PNG, WebP ou GIF.',
        })
      }

      const cfg = assertR2Configured()
      const extension = resolveExtension(fileName, fileType)
      const key = `vetements/${randomUUID()}.${extension}`

      const command = new PutObjectCommand({
        Bucket: cfg.bucketName,
        Key: key,
        ContentType: fileType,
      })

      const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 300 })
      const publicUrl = buildPublicUrl(key)

      return { uploadUrl, publicUrl, key }
    }
    catch (err) {
      fastify.log.error(err)
      return reply.code(503).send({
        error: err instanceof Error ? err.message : 'Upload R2 indisponible',
      })
    }
  })

  fastify.get('/upload/status', async () => {
    try {
      const cfg = getR2Config()
      assertR2Configured()
      return {
        configured: true,
        bucket: cfg.bucketName,
        publicUrl: cfg.publicUrl,
        mode: 'proxy',
      }
    }
    catch {
      return { configured: false }
    }
  })
}
