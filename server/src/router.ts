import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createResponse, parseJsonBody } from './lib/http';
import { verifyToken } from './lib/auth';
import { logger } from './lib/logger';
import { ValidationError, NotFoundError, UnauthorizedError, ConflictError } from './lib/errors';
import { getUploadUrl } from './services/upload.service';
import { projectsService, blogPostsService, authService } from './services';
import { validateReorderInput } from './validation/content';
import { ROUTE_SEGMENTS } from './config/resources';

export async function routeRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const method = event.httpMethod;
  // Try multiple path sources - API Gateway can provide path in different places
  const path = event.path || event.requestContext?.path || event.resource || '';

  try {
    if (method === 'OPTIONS') {
      return createResponse(200, {}, event);
    }

    const pathParts = path.split('/').filter(Boolean);

    if (method === 'POST' && path.includes(ROUTE_SEGMENTS.authLogin)) {
      const result = await authService.login(event.body);
      return createResponse(200, result, event);
    }

    // Upload endpoint - match the final path segment exactly (not a substring
    // check) so e.g. /projects/upload-history doesn't get misrouted here.
    // pathParts is derived from `path` above, so this already handles stage
    // prefixes (/prod/upload) and proxy routes ({proxy+}) the same way.
    const isUploadRoute =
      method === 'POST' && pathParts[pathParts.length - 1] === ROUTE_SEGMENTS.upload;

    if (isUploadRoute) {
      const auth = verifyToken(event);
      if (!auth.valid || !auth.userId) {
        return createResponse(401, { error: 'Unauthorized - Invalid or missing token' }, event);
      }
      const result = await getUploadUrl(auth.userId, event.body);
      return createResponse(200, result, event);
    }

    // Public GET endpoints (projects and blog posts)
    if (pathParts[0] === ROUTE_SEGMENTS.projects) {
      if (method === 'GET' && pathParts.length === 1) {
        return createResponse(200, { projects: await projectsService.list() }, event);
      }
      if (method === 'GET' && pathParts.length === 2) {
        return createResponse(
          200,
          { project: await projectsService.getBySlug(pathParts[1]) },
          event
        );
      }
    }

    if (pathParts[0] === ROUTE_SEGMENTS.blogPosts || pathParts[0] === ROUTE_SEGMENTS.blog) {
      if (method === 'GET' && pathParts.length === 1) {
        return createResponse(200, { posts: await blogPostsService.list() }, event);
      }
      if (method === 'GET' && pathParts.length === 2) {
        return createResponse(200, { post: await blogPostsService.getBySlug(pathParts[1]) }, event);
      }
    }

    // Protected endpoints - require authentication
    const auth = verifyToken(event);
    if (!auth.valid) {
      return createResponse(401, { error: 'Unauthorized - Invalid or missing token' }, event);
    }

    // Projects endpoints (write operations)
    if (pathParts[0] === ROUTE_SEGMENTS.projects) {
      if (method === 'POST' && pathParts[1] === ROUTE_SEGMENTS.reorder) {
        await projectsService.reorder(validateReorderInput(parseJsonBody(event.body)));
        return createResponse(200, { message: 'Projects reordered successfully' }, event);
      }
      if (method === 'POST') {
        const project = await projectsService.create(parseJsonBody(event.body));
        return createResponse(201, { project }, event);
      }
      if (method === 'PUT' && pathParts.length === 2) {
        await projectsService.update(pathParts[1], parseJsonBody(event.body));
        return createResponse(200, { message: 'Project updated successfully' }, event);
      }
      if (method === 'DELETE' && pathParts.length === 2) {
        await projectsService.remove(pathParts[1]);
        return createResponse(200, { message: 'Project deleted successfully' }, event);
      }
    }

    // Blog posts endpoints (write operations)
    if (pathParts[0] === ROUTE_SEGMENTS.blogPosts || pathParts[0] === ROUTE_SEGMENTS.blog) {
      if (method === 'POST' && pathParts[1] === ROUTE_SEGMENTS.reorder) {
        await blogPostsService.reorder(validateReorderInput(parseJsonBody(event.body)));
        return createResponse(200, { message: 'Blog posts reordered successfully' }, event);
      }
      if (method === 'POST') {
        const post = await blogPostsService.create(parseJsonBody(event.body));
        return createResponse(201, { post }, event);
      }
      if (method === 'PUT' && pathParts.length === 2) {
        await blogPostsService.update(pathParts[1], parseJsonBody(event.body));
        return createResponse(200, { message: 'Blog post updated successfully' }, event);
      }
      if (method === 'DELETE' && pathParts.length === 2) {
        await blogPostsService.remove(pathParts[1]);
        return createResponse(200, { message: 'Blog post deleted successfully' }, event);
      }
    }

    return createResponse(404, { error: 'Not found', path, method }, event);
  } catch (error) {
    return handleError(error, event);
  }
}

function handleError(error: unknown, event: APIGatewayProxyEvent): APIGatewayProxyResult {
  if (error instanceof ValidationError) {
    return createResponse(400, { error: error.message }, event);
  }
  if (error instanceof UnauthorizedError) {
    return createResponse(401, { error: error.message }, event);
  }
  if (error instanceof NotFoundError) {
    return createResponse(404, { error: error.message }, event);
  }
  if (error instanceof ConflictError) {
    return createResponse(409, { error: error.message }, event);
  }

  logger.error('Unhandled error', {
    message: error instanceof Error ? error.message : String(error),
  });
  return createResponse(500, { error: 'Internal server error' }, event);
}
