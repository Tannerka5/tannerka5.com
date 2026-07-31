import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as jwt from 'jsonwebtoken';
import type { APIGatewayProxyEvent } from 'aws-lambda';

function makeEvent(headers: Record<string, string>): APIGatewayProxyEvent {
  return { headers } as unknown as APIGatewayProxyEvent;
}

describe('lib/auth', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('throws at module load if JWT_SECRET is unset', async () => {
    delete process.env.JWT_SECRET;
    await expect(import('../auth')).rejects.toThrow('JWT_SECRET environment variable is required');
  });

  it('signToken produces a token verifyToken accepts', async () => {
    const { signToken, verifyToken } = await import('../auth');
    const token = signToken({ userId: 'user-1', username: 'admin' });

    const result = verifyToken(makeEvent({ Authorization: `Bearer ${token}` }));

    expect(result).toEqual({ valid: true, userId: 'user-1' });
  });

  it('rejects a missing Authorization header', async () => {
    const { verifyToken } = await import('../auth');
    expect(verifyToken(makeEvent({}))).toEqual({ valid: false });
  });

  it('rejects a header without the Bearer prefix', async () => {
    const { verifyToken } = await import('../auth');
    expect(verifyToken(makeEvent({ Authorization: 'not-a-bearer-token' }))).toEqual({
      valid: false,
    });
  });

  it('rejects a token signed with a different secret', async () => {
    const { verifyToken } = await import('../auth');
    const forgedToken = jwt.sign({ userId: 'attacker' }, 'wrong-secret', { algorithm: 'HS256' });

    expect(verifyToken(makeEvent({ Authorization: `Bearer ${forgedToken}` }))).toEqual({
      valid: false,
    });
  });

  it('rejects a token signed with a different algorithm (alg-confusion defense)', async () => {
    const { verifyToken } = await import('../auth');
    // Sign with the same secret but a different algorithm than the pinned HS256
    const token = jwt.sign({ userId: 'user-1' }, 'test-secret', { algorithm: 'HS384' });

    expect(verifyToken(makeEvent({ Authorization: `Bearer ${token}` }))).toEqual({ valid: false });
  });
});
