import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import type { UsersRepository } from '../repositories/users.repository';
import { signToken } from '../lib/auth';
import { UnauthorizedError, ValidationError } from '../lib/errors';
import { logger } from '../lib/logger';
import { parseJsonBody } from '../lib/http';
import type { User } from '../types';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''; // Set via bcrypt.hashSync('your-password', 10)

export interface LoginResult {
  token: string;
  user: { username: string; userId: string };
}

export interface AuthService {
  login(rawBody: string | null): Promise<LoginResult>;
}

export function createAuthService(usersRepository: UsersRepository): AuthService {
  return {
    async login(rawBody: string | null): Promise<LoginResult> {
      const input = parseJsonBody<{ username?: unknown; password?: unknown }>(rawBody);
      const username = typeof input.username === 'string' ? input.username : '';
      const password = typeof input.password === 'string' ? input.password : '';

      if (!username || !password) {
        throw new ValidationError('Username and password are required');
      }

      let user: User | null = null;
      try {
        user = await usersRepository.findByUsername(username);
      } catch (error) {
        logger.error('Failed to query users table', {
          message: error instanceof Error ? error.message : String(error),
        });
      }

      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          throw new UnauthorizedError('Invalid credentials');
        }
        return {
          token: signToken({ userId: user.id, username: user.username }),
          user: { username: user.username, userId: user.id },
        };
      }

      // Fallback for initial admin setup: no user record exists yet (or the
      // users table couldn't be queried), so accept the env-configured hash.
      if (ADMIN_PASSWORD_HASH && username === 'admin') {
        const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (isValidPassword) {
          const adminUser: User = {
            id: uuidv4(),
            username: 'admin',
            passwordHash: ADMIN_PASSWORD_HASH,
            role: 'admin',
            createdAt: Date.now(),
          };
          try {
            await usersRepository.create(adminUser);
          } catch (error) {
            logger.error('Failed to persist fallback admin user', {
              message: error instanceof Error ? error.message : String(error),
            });
          }
          return {
            token: signToken({ userId: adminUser.id, username: 'admin' }),
            user: { username: 'admin', userId: adminUser.id },
          };
        }
      }

      throw new UnauthorizedError('Invalid credentials');
    },
  };
}
