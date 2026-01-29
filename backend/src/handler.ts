import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
  QueryCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Initialize S3 client with region
const AWS_REGION = process.env.AWS_REGION || 'us-east-2';
const s3Client = new S3Client({ region: AWS_REGION });

// Table names
const PROJECTS_TABLE = process.env.PROJECTS_TABLE || 'portfolio-projects';
const BLOG_POSTS_TABLE = process.env.BLOG_POSTS_TABLE || 'portfolio-blog-posts';
const USERS_TABLE = process.env.USERS_TABLE || 'portfolio-users';
// Note: Users table should have a GSI named 'username-index' with 'username' as partition key

// S3 bucket name
const UPLOADS_BUCKET = process.env.S3_BUCKET || process.env.UPLOADS_BUCKET || 'tannerka5-portfolio-upload';
const UPLOADS_PREFIX = process.env.UPLOADS_PREFIX || 'uploads/';

// File upload constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const PRESIGNED_URL_EXPIRATION = 15 * 60; // 15 minutes in seconds

// Secrets
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''; // Set via bcrypt.hashSync('your-password', 10)


// Helper function to create response with proper CORS headers
const createResponse = (statusCode: number, body: any, event?: APIGatewayProxyEvent, customHeaders?: Record<string, string>): APIGatewayProxyResult => {
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin;
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

  // If wildcard is configured or no specific origin, use wildcard
  // Otherwise, if request origin matches allowed origin, echo it back
  let corsOrigin = allowedOrigin;

  if (allowedOrigin !== '*' && requestOrigin) {
    // Check if request origin matches allowed origin
    // Support multiple origins separated by comma
    const allowedOrigins = allowedOrigin.split(',').map(o => o.trim());

    if (allowedOrigins.includes(requestOrigin) ||
      allowedOrigins.includes('*') ||
      // Allow localhost for development
      (requestOrigin.includes('localhost') && (allowedOrigins.includes('*') || allowedOrigins.some(o => o.includes('localhost'))))) {
      corsOrigin = requestOrigin;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    ...customHeaders,
  };

  // Add credentials header if not using wildcard (required for cookies/auth headers)
  if (corsOrigin !== '*') {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
};

// JWT verification
const verifyToken = (event: APIGatewayProxyEvent): { valid: boolean; userId?: string } => {
  try {
    const authHeader = event.headers['Authorization'] || event.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; exp: number };
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false };
  }
};

// Authentication endpoints
async function login(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' }, event);
  }

  const { username, password } = JSON.parse(event.body);

  if (!username || !password) {
    return createResponse(400, { error: 'Username and password are required' }, event);
  }

  try {
    // Try to fetch user from DynamoDB
    const userResult = await docClient.send(new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'username-index',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: { ':username': username }
    }));

    let user: any = null;

    if (userResult.Items && userResult.Items.length > 0) {
      // User found in database
      user = userResult.Items[0];
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (isValidPassword) {
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return createResponse(200, {
          token,
          user: { username: user.username, userId: user.id }
        }, event);
      }
    } else {
      // Fallback to environment variable for initial setup
      // This allows you to set up the first admin user via environment variable
      if (ADMIN_PASSWORD_HASH && username === 'admin') {
        const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

        if (isValidPassword) {
          // Create the admin user in DynamoDB for future use
          const adminUser = {
            id: uuidv4(),
            username: 'admin',
            passwordHash: ADMIN_PASSWORD_HASH,
            role: 'admin',
            createdAt: Date.now()
          };

          await docClient.send(new PutCommand({
            TableName: USERS_TABLE,
            Item: adminUser
          }));

          const token = jwt.sign(
            { userId: adminUser.id, username: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          return createResponse(200, {
            token,
            user: { username: 'admin', userId: adminUser.id }
          }, event);
        }
      }
    }

    return createResponse(401, { error: 'Invalid credentials' }, event);
  } catch (error) {
    console.error('Login error:', error);
    // Fallback to environment variable if DynamoDB fails
    if (ADMIN_PASSWORD_HASH && username === 'admin') {
      const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

      if (isValidPassword) {
        const token = jwt.sign(
          { userId: 'admin', username: 'admin' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return createResponse(200, {
          token,
          user: { username: 'admin', userId: 'admin' }
        }, event);
      }
    }

    return createResponse(401, { error: 'Invalid credentials' }, event);
  }
}

// Main Lambda handler
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const method = event.httpMethod;
  // Try multiple path sources - API Gateway can provide path in different places
  const path = event.path || event.requestContext?.path || event.resource || '';
  const resource = event.resource || '';

  console.log('Path info:', {
    path,
    resource,
    method,
    requestContextPath: event.requestContext?.path,
    eventPath: event.path
  });

  try {
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return createResponse(200, {}, event);
    }

    // Route handling
    const pathParts = path.split('/').filter(p => p);

    // Public endpoints
    if (method === 'POST' && path.includes('/auth/login')) {
      return await login(event);
    }

    // Upload endpoint - check for /upload in path (handles stage prefixes like /prod/upload)
    // Also check if using proxy route - in that case, check the last path segment
    const isUploadRoute = method === 'POST' && (
      path.includes('/upload') ||
      path.endsWith('/upload') ||
      (resource === '/{proxy+}' && pathParts[pathParts.length - 1] === 'upload') ||
      resource === '/upload'
    );

    if (isUploadRoute) {
      console.log('Upload endpoint matched, path:', path, 'resource:', resource, 'pathParts:', pathParts);
      const auth = verifyToken(event);
      if (!auth.valid) {
        console.log('Upload endpoint: Authentication failed');
        return createResponse(401, { error: 'Unauthorized - Invalid or missing token' }, event);
      }
      console.log('Upload endpoint: Generating pre-signed URL');
      return await getUploadUrl(event);
    }

    // Public GET endpoints (projects and blog posts)
    if (pathParts[0] === 'projects') {
      if (method === 'GET' && pathParts.length === 1) {
        return await getProjects(event);
      }
      if (method === 'GET' && pathParts.length === 2) {
        return await getProject(pathParts[1], event);
      }
    }

    if (pathParts[0] === 'blog-posts' || pathParts[0] === 'blog') {
      if (method === 'GET' && pathParts.length === 1) {
        return await getBlogPosts(event);
      }
      if (method === 'GET' && pathParts.length === 2) {
        return await getBlogPost(pathParts[1], event);
      }
    }

    // Protected endpoints - require authentication
    const auth = verifyToken(event);
    if (!auth.valid) {
      return createResponse(401, { error: 'Unauthorized - Invalid or missing token' }, event);
    }

    // Projects endpoints (write operations)
    if (pathParts[0] === 'projects') {
      if (method === 'POST') {
        return await createProject(event);
      }
      if (method === 'PUT' && pathParts.length === 2) {
        return await updateProject(pathParts[1], event);
      }
      if (method === 'DELETE' && pathParts.length === 2) {
        return await deleteProject(pathParts[1], event);
      }
      if (method === 'POST' && pathParts[1] === 'reorder') {
        return await reorderProjects(event);
      }
    }

    // Blog posts endpoints (write operations)
    if (pathParts[0] === 'blog-posts' || pathParts[0] === 'blog') {
      if (method === 'POST') {
        return await createBlogPost(event);
      }
      if (method === 'PUT' && pathParts.length === 2) {
        return await updateBlogPost(pathParts[1], event);
      }
      if (method === 'DELETE' && pathParts.length === 2) {
        return await deleteBlogPost(pathParts[1], event);
      }
      if (method === 'POST' && pathParts[1] === 'reorder') {
        return await reorderBlogPosts(event);
      }
    }

    console.log('No route matched:', { method, path, pathParts });
    return createResponse(404, { error: 'Not found', path, method }, event);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, event);
  }
};

// ==================== PROJECTS ====================

async function getProjects(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const result = await docClient.send(new ScanCommand({
    TableName: PROJECTS_TABLE
  }));

  const projects = (result.Items || []) as any[];
  projects.sort((a, b) => (a.order || 0) - (b.order || 0));

  return createResponse(200, { projects }, event);
}

async function getProject(slug: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const result = await docClient.send(new QueryCommand({
    TableName: PROJECTS_TABLE,
    IndexName: 'slug-index',
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: { ':slug': slug }
  }));

  if (!result.Items || result.Items.length === 0) {
    return createResponse(404, { error: 'Project not found' }, event);
  }

  return createResponse(200, { project: result.Items[0] }, event);
}

async function createProject(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' }, event);
  }

  const input = JSON.parse(event.body);

  // Get max order
  const projects = await docClient.send(new ScanCommand({ TableName: PROJECTS_TABLE }));
  const maxOrder = Math.max(0, ...((projects.Items || []).map((p: any) => p.order || 0)));

  const project = {
    id: uuidv4(),
    slug: input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...input,
    order: input.order !== undefined ? input.order : maxOrder + 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await docClient.send(new PutCommand({
    TableName: PROJECTS_TABLE,
    Item: project
  }));

  return createResponse(201, { project }, event);
}

async function updateProject(slug: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' }, event);
    }

    const input = JSON.parse(event.body);

    // Get existing project
    const existing = await docClient.send(new QueryCommand({
      TableName: PROJECTS_TABLE,
      IndexName: 'slug-index',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: { ':slug': slug }
    }));

    if (!existing.Items || existing.Items.length === 0) {
      return createResponse(404, { error: 'Project not found' }, event);
    }

    const existingProject = existing.Items[0];

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Update all provided fields (excluding id and slug)
    // Always override updatedAt with current timestamp
    Object.keys(input).forEach(key => {
      if (key !== 'id' && key !== 'slug' && input[key] !== undefined) {
        // Skip updatedAt from input - we'll set it to current timestamp
        if (key === 'updatedAt') {
          return;
        }
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = input[key];
      }
    });

    // Always update the updatedAt timestamp with current time (override any value from input)
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = Date.now();

    await docClient.send(new UpdateCommand({
      TableName: PROJECTS_TABLE,
      Key: { id: existingProject.id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }));

    return createResponse(200, { message: 'Project updated successfully' }, event);
  } catch (error) {
    console.error('Error updating project:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      slug,
      body: event.body ? JSON.parse(event.body) : null
    });
    return createResponse(500, {
      error: 'Failed to update project',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, event);
  }
}

async function deleteProject(slug: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const existing = await docClient.send(new QueryCommand({
    TableName: PROJECTS_TABLE,
    IndexName: 'slug-index',
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: { ':slug': slug }
  }));

  if (!existing.Items || existing.Items.length === 0) {
    return createResponse(404, { error: 'Project not found' }, event);
  }

  await docClient.send(new DeleteCommand({
    TableName: PROJECTS_TABLE,
    Key: { id: existing.Items[0].id }
  }));

  return createResponse(200, { message: 'Project deleted successfully' }, event);
}

async function reorderProjects(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' }, event);
  }

  const { items } = JSON.parse(event.body); // Array of { id, order }

  const writeRequests = items.map((item: { id: string; order: number }) => ({
    PutRequest: {
      Item: {
        // Need to get full item first, then update order
      }
    }
  }));

  // For simplicity, do individual updates
  for (const item of items) {
    await docClient.send(new UpdateCommand({
      TableName: PROJECTS_TABLE,
      Key: { id: item.id },
      UpdateExpression: 'SET #order = :order, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#order': 'order',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':order': item.order,
        ':updatedAt': Date.now()
      }
    }));
  }

  return createResponse(200, { message: 'Projects reordered successfully' }, event);
}

// ==================== BLOG POSTS ====================

async function getBlogPosts(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const result = await docClient.send(new ScanCommand({
    TableName: BLOG_POSTS_TABLE
  }));

  const posts = (result.Items || []) as any[];
  posts.sort((a, b) => (a.order || 0) - (b.order || 0));

  return createResponse(200, { posts }, event);
}

async function getBlogPost(slug: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const result = await docClient.send(new QueryCommand({
    TableName: BLOG_POSTS_TABLE,
    IndexName: 'slug-index',
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: { ':slug': slug }
  }));

  if (!result.Items || result.Items.length === 0) {
    return createResponse(404, { error: 'Blog post not found' }, event);
  }

  return createResponse(200, { post: result.Items[0] }, event);
}

async function createBlogPost(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' }, event);
  }

  const input = JSON.parse(event.body);

  // Get max order
  const posts = await docClient.send(new ScanCommand({ TableName: BLOG_POSTS_TABLE }));
  const maxOrder = Math.max(0, ...((posts.Items || []).map((p: any) => p.order || 0)));

  const post = {
    id: uuidv4(),
    slug: input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...input,
    order: input.order !== undefined ? input.order : maxOrder + 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await docClient.send(new PutCommand({
    TableName: BLOG_POSTS_TABLE,
    Item: post
  }));

  return createResponse(201, { post }, event);
}

async function updateBlogPost(slug: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' }, event);
    }

    const input = JSON.parse(event.body);

    const existing = await docClient.send(new QueryCommand({
      TableName: BLOG_POSTS_TABLE,
      IndexName: 'slug-index',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: { ':slug': slug }
    }));

    if (!existing.Items || existing.Items.length === 0) {
      return createResponse(404, { error: 'Blog post not found' }, event);
    }

    const existingPost = existing.Items[0];

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Update all provided fields (excluding id and slug)
    // Always override updatedAt with current timestamp
    Object.keys(input).forEach(key => {
      if (key !== 'id' && key !== 'slug' && input[key] !== undefined) {
        // Skip updatedAt from input - we'll set it to current timestamp
        if (key === 'updatedAt') {
          return;
        }
        // Use ExpressionAttributeNames to handle reserved words
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = input[key];
      }
    });

    // Always update the updatedAt timestamp with current time (override any value from input)
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = Date.now();

    if (updateExpressions.length === 0) {
      return createResponse(400, { error: 'No fields to update' }, event);
    }

    await docClient.send(new UpdateCommand({
      TableName: BLOG_POSTS_TABLE,
      Key: { id: existingPost.id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }));

    return createResponse(200, { message: 'Blog post updated successfully' }, event);
  } catch (error) {
    console.error('Error updating blog post:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      slug,
      body: event.body ? JSON.parse(event.body) : null
    });
    return createResponse(500, {
      error: 'Failed to update blog post',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, event);
  }
}

async function deleteBlogPost(slug: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const existing = await docClient.send(new QueryCommand({
    TableName: BLOG_POSTS_TABLE,
    IndexName: 'slug-index',
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: { ':slug': slug }
  }));

  if (!existing.Items || existing.Items.length === 0) {
    return createResponse(404, { error: 'Blog post not found' }, event);
  }

  await docClient.send(new DeleteCommand({
    TableName: BLOG_POSTS_TABLE,
    Key: { id: existing.Items[0].id }
  }));

  return createResponse(200, { message: 'Blog post deleted successfully' }, event);
}

async function reorderBlogPosts(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' }, event);
  }

  const { items } = JSON.parse(event.body);

  for (const item of items) {
    await docClient.send(new UpdateCommand({
      TableName: BLOG_POSTS_TABLE,
      Key: { id: item.id },
      UpdateExpression: 'SET #order = :order, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#order': 'order',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':order': item.order,
        ':updatedAt': Date.now()
      }
    }));
  }

  return createResponse(200, { message: 'Blog posts reordered successfully' }, event);
}

// ==================== UPLOADS ====================

async function getUploadUrl(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' }, event);
  }

  try {
    // Verify authentication and get userId
    const auth = verifyToken(event);
    if (!auth.valid || !auth.userId) {
      return createResponse(401, { error: 'Unauthorized - Authentication required' }, event);
    }

    const { filename, contentType, fileSize } = JSON.parse(event.body);

    if (!filename || !contentType) {
      return createResponse(400, { error: 'filename and contentType are required' }, event);
    }

    // Validate file size (max 10MB)
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return createResponse(400, {
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      }, event);
    }

    // Sanitize filename to prevent path traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileExtension = sanitizedFilename.split('.').pop() || '';
    const timestamp = Date.now();

    // Organize files by userId: uploads/{userId}/{timestamp}-{filename}
    const key = `${UPLOADS_PREFIX}${auth.userId}/${timestamp}-${sanitizedFilename}`;

    // Create presigned URL for PUT operation (expires in 15 minutes)
    const command = new PutObjectCommand({
      Bucket: UPLOADS_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: PRESIGNED_URL_EXPIRATION });

    // Return the upload URL and the public URL
    // Use the correct region in the public URL
    const publicUrl = `https://${UPLOADS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    return createResponse(200, {
      uploadUrl,
      url: publicUrl,
      key,
      expiresIn: PRESIGNED_URL_EXPIRATION
    }, event);
  } catch (error) {
    console.error('Upload URL generation error:', error);
    return createResponse(500, {
      error: 'Failed to generate upload URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, event);
  }
}