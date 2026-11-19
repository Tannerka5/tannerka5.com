import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_REGION } from '../lib/aws-clients';
import { parseJsonBody } from '../lib/http';
import { ValidationError } from '../lib/errors';

const UPLOADS_BUCKET =
  process.env.S3_BUCKET || process.env.UPLOADS_BUCKET || 'tannerka5-portfolio-upload';
const UPLOADS_PREFIX = process.env.UPLOADS_PREFIX || 'uploads/';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const PRESIGNED_URL_EXPIRATION = 15 * 60; // 15 minutes in seconds

export interface UploadUrlResult {
  uploadUrl: string;
  url: string;
  key: string;
  expiresIn: number;
}

export async function getUploadUrl(
  userId: string,
  rawBody: string | null
): Promise<UploadUrlResult> {
  const input = parseJsonBody<{ filename?: unknown; contentType?: unknown; fileSize?: unknown }>(
    rawBody
  );

  if (typeof input.filename !== 'string' || typeof input.contentType !== 'string') {
    throw new ValidationError('filename and contentType are required');
  }

  if (typeof input.fileSize === 'number' && input.fileSize > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }

  // Sanitize filename to prevent path traversal
  const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();

  // Organize files by userId: uploads/{userId}/{timestamp}-{filename}
  const key = `${UPLOADS_PREFIX}${userId}/${timestamp}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: UPLOADS_BUCKET,
    Key: key,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: PRESIGNED_URL_EXPIRATION });
  const publicUrl = `https://${UPLOADS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, url: publicUrl, key, expiresIn: PRESIGNED_URL_EXPIRATION };
}
