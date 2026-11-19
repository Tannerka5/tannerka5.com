import { docClient } from '../lib/aws-clients';
import { ContentRepository } from '../repositories/content.repository';
import { UsersRepository } from '../repositories/users.repository';
import { ContentService } from './content.service';
import { createAuthService } from './auth.service';
import {
  PROJECT_RESOURCE,
  BLOG_POST_RESOURCE,
  USERS_TABLE,
  USERNAME_INDEX_NAME,
} from '../config/resources';
import type { Project, BlogPost } from '../types';

// Composition root: the only place repositories are constructed and wired
// into services, so router.ts can depend on services alone.
export const projectsService = new ContentService<Project>({
  repository: new ContentRepository<Project>(
    docClient,
    PROJECT_RESOURCE.tableName,
    PROJECT_RESOURCE.slugIndexName
  ),
  notFoundMessage: PROJECT_RESOURCE.notFoundMessage,
  updatableFields: PROJECT_RESOURCE.updatableFields,
});

export const blogPostsService = new ContentService<BlogPost>({
  repository: new ContentRepository<BlogPost>(
    docClient,
    BLOG_POST_RESOURCE.tableName,
    BLOG_POST_RESOURCE.slugIndexName
  ),
  notFoundMessage: BLOG_POST_RESOURCE.notFoundMessage,
  updatableFields: BLOG_POST_RESOURCE.updatableFields,
});

export const authService = createAuthService(
  new UsersRepository(docClient, USERS_TABLE, USERNAME_INDEX_NAME)
);
