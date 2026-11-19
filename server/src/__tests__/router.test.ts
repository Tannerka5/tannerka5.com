import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import * as jwt from 'jsonwebtoken';
import type { APIGatewayProxyEvent } from 'aws-lambda';

process.env.JWT_SECRET = 'test-secret';
process.env.ALLOWED_ORIGIN = 'https://tannerka5.com';

const ddbMock = mockClient(DynamoDBDocumentClient);

function baseEvent(overrides: Partial<APIGatewayProxyEvent>): APIGatewayProxyEvent {
  return {
    httpMethod: 'GET',
    path: '/',
    resource: '/{proxy+}',
    headers: {},
    body: null,
    requestContext: {},
    ...overrides,
  } as unknown as APIGatewayProxyEvent;
}

describe('routeRequest', () => {
  let routeRequest: typeof import('../router').routeRequest;
  let authHeaders: Record<string, string>;

  beforeAll(async () => {
    ({ routeRequest } = await import('../router'));
    const token = jwt.sign({ userId: 'user-1', username: 'admin' }, 'test-secret', {
      algorithm: 'HS256',
    });
    authHeaders = { Authorization: `Bearer ${token}` };
  });

  beforeEach(() => {
    ddbMock.reset();
  });

  // Regression test for the original bug: a bare "if (method === 'POST')"
  // check ran before the more-specific reorder check, so POST /projects/reorder
  // was silently misrouted into createProject and crashed on the missing title.
  it('routes POST /projects/reorder to reorder, not create', async () => {
    ddbMock.on(UpdateCommand).resolves({});

    const response = await routeRequest(
      baseEvent({
        httpMethod: 'POST',
        path: '/projects/reorder',
        resource: '/{proxy+}',
        headers: authHeaders,
        body: JSON.stringify({ items: [{ id: 'proj-1', order: 0 }] }),
      })
    );

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: 'Projects reordered successfully' });
    // If this had been misrouted into createProject, it would have queried
    // slug-index looking for a duplicate slug -- assert that never happened.
    expect(ddbMock.commandCalls(QueryCommand)).toHaveLength(0);
    expect(ddbMock.commandCalls(UpdateCommand)).toHaveLength(1);
  });

  it('routes POST /blog-posts/reorder to reorder, not create', async () => {
    ddbMock.on(UpdateCommand).resolves({});

    const response = await routeRequest(
      baseEvent({
        httpMethod: 'POST',
        path: '/blog-posts/reorder',
        resource: '/{proxy+}',
        headers: authHeaders,
        body: JSON.stringify({ items: [{ id: 'post-1', order: 0 }] }),
      })
    );

    expect(response.statusCode).toBe(200);
    expect(ddbMock.commandCalls(QueryCommand)).toHaveLength(0);
  });

  // Regression test: isUploadRoute used to be a substring check
  // (path.includes('/upload')), so a path like /projects/upload-history
  // matched and got misrouted into the S3 presigned-upload handler instead
  // of reaching the normal create-project path.
  it('does not misroute a path that merely contains "upload" into the upload handler', async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [] });
    ddbMock.on(PutCommand).resolves({});

    const response = await routeRequest(
      baseEvent({
        httpMethod: 'POST',
        path: '/projects/upload-history',
        resource: '/{proxy+}',
        headers: authHeaders,
        body: JSON.stringify({ title: 'Not an upload' }),
      })
    );

    expect(response.statusCode).toBe(201);
    // findBySlug (QueryCommand) running confirms this hit create(), not the
    // S3 upload path.
    expect(ddbMock.commandCalls(QueryCommand)).toHaveLength(1);
  });

  it('rejects writes without a valid token', async () => {
    const response = await routeRequest(
      baseEvent({
        httpMethod: 'POST',
        path: '/projects',
        resource: '/projects',
        body: JSON.stringify({ title: 'New' }),
      })
    );
    expect(response.statusCode).toBe(401);
  });

  it('does not echo back a disallowed CORS origin', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [] });
    const response = await routeRequest(
      baseEvent({
        httpMethod: 'GET',
        path: '/projects',
        resource: '/projects',
        headers: { origin: 'https://evil.example.com' },
      })
    );
    expect(response.headers?.['Access-Control-Allow-Origin']).not.toBe('https://evil.example.com');
  });
});
