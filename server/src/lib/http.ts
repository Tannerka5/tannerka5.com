import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from './errors';

// Strict CORS allowlist — exact origin match only, no wildcard, no dev bypass
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGIN || 'https://tannerka5.com,https://www.tannerka5.com'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export function createResponse(
  statusCode: number,
  body: unknown,
  event?: APIGatewayProxyEvent,
  customHeaders?: Record<string, string>
): APIGatewayProxyResult {
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin;
  const corsOrigin =
    requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : ALLOWED_ORIGINS[0];

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    ...customHeaders,
  };

  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

export function parseJsonBody<T = unknown>(body: string | null): T {
  if (!body) {
    throw new ValidationError('Request body is required');
  }
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ValidationError('Request body must be valid JSON');
  }
}
