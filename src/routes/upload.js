import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { r2Client } from '../plugins/r2Client.js';

export default async function uploadRoutes(fastify) {
  /**
   * POST /upload/presign
   * Body: { fileName: string, fileType: string }
   * Retourne une URL présignée valable 5 min pour uploader directement
   * l'image depuis le frontend vers R2 (sans passer par l'API).
   */
  fastify.post('/upload/presign', async (request, reply) => {
    const { fileName, fileType } = request.body;

    if (!fileName || !fileType) {
      return reply.code(400).send({ error: 'fileName et fileType sont requis' });
    }

    // On génère un nom de fichier unique pour éviter les collisions
    const extension = fileName.split('.').pop();
    const key = `vetements/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

    // publicUrl est ce qu'il faut stocker dans pic_path une fois l'upload confirmé
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return { uploadUrl, publicUrl };
  });
}
