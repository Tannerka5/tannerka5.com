import * as jwt from 'jsonwebtoken';
import type { APIGatewayProxyEvent } from 'aws-lambda';

// Fail the whole Lambda at cold start rather than silently signing/verifying
// tokens with a fallback secret if this is ever misconfigured.
export const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
})();

export interface AuthResult {
  valid: boolean;
  userId?: string;
}

export function verifyToken(event: APIGatewayProxyEvent): AuthResult {
  try {
    const authHeader = event.headers['Authorization'] || event.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as {
      userId: string;
      exp: number;
    };
    return { valid: true, userId: decoded.userId };
  } catch {
    return { valid: false };
  }
}

export function signToken(payload: { userId: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h', algorithm: 'HS256' });
}
