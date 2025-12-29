import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  logoPath: string;
  dateAdded: number;
  dateUpdated: number;
}

interface CreateProjectInput {
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  logoPath: string;
}

interface UpdateProjectInput {
  title?: string;
  description?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  logoPath?: string;
}

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'portfolio-projects';
const API_KEY = process.env.API_KEY || '';

// CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://tannerka5.com',
  'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Helper function to create response
const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers,
  body: JSON.stringify(body)
});

// Validate API key for protected routes
const validateApiKey = (event: APIGatewayProxyEvent): boolean => {
  const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  return apiKey === API_KEY;
};

// Main Lambda handler
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const method = event.httpMethod;
  const path = event.path;

  try {
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return createResponse(200, {});
    }

    // GET /projects - Public endpoint
    if (method === 'GET' && path === '/projects') {
      return await getProjects();
    }

    // All other endpoints require authentication
    if (!validateApiKey(event)) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // POST /projects - Create new project
    if (method === 'POST' && path === '/projects') {
      return await createProject(event);
    }

    // PUT /projects/{id} - Update project
    if (method === 'PUT' && path.startsWith('/projects/')) {
      const id = path.split('/')[2];
      return await updateProject(id, event);
    }

    // DELETE /projects/{id} - Delete project
    if (method === 'DELETE' && path.startsWith('/projects/')) {
      const id = path.split('/')[2];
      return await deleteProject(id);
    }

    // GET /projects/{id} - Get single project (optional, for future use)
    if (method === 'GET' && path.startsWith('/projects/')) {
      const id = path.split('/')[2];
      return await getProject(id);
    }

    return createResponse(404, { error: 'Not found' });

  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all projects
async function getProjects(): Promise<APIGatewayProxyResult> {
  const result = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME
  }));

  const projects = (result.Items || []) as Project[];
  
  // Sort by dateAdded (newest first)
  projects.sort((a, b) => b.dateAdded - a.dateAdded);

  return createResponse(200, { projects });
}

// Get single project
async function getProject(id: string): Promise<APIGatewayProxyResult> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));

  if (!result.Item) {
    return createResponse(404, { error: 'Project not found' });
  }

  return createResponse(200, { project: result.Item as Project });
}

// Create new project
async function createProject(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' });
  }

  const input: CreateProjectInput = JSON.parse(event.body);

  // Validate required fields
  if (!input.title || !input.description) {
    return createResponse(400, { error: 'Title and description are required' });
  }

  const now = Date.now();
  const project: Project = {
    id: uuidv4(),
    title: input.title,
    description: input.description,
    technologies: input.technologies || [],
    liveUrl: input.liveUrl || '',
    githubUrl: input.githubUrl || '',
    logoPath: input.logoPath || '',
    dateAdded: now,
    dateUpdated: now
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: project
  }));

  return createResponse(201, { 
    id: project.id, 
    message: 'Project created successfully',
    project 
  });
}

// Update project
async function updateProject(id: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' });
  }

  const input: UpdateProjectInput = JSON.parse(event.body);

  // Build update expression dynamically
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  if (input.title) {
    updateExpressions.push('#title = :title');
    expressionAttributeNames['#title'] = 'title';
    expressionAttributeValues[':title'] = input.title;
  }

  if (input.description) {
    updateExpressions.push('#description = :description');
    expressionAttributeNames['#description'] = 'description';
    expressionAttributeValues[':description'] = input.description;
  }

  if (input.technologies) {
    updateExpressions.push('#technologies = :technologies');
    expressionAttributeNames['#technologies'] = 'technologies';
    expressionAttributeValues[':technologies'] = input.technologies;
  }

  if (input.liveUrl !== undefined) {
    updateExpressions.push('#liveUrl = :liveUrl');
    expressionAttributeNames['#liveUrl'] = 'liveUrl';
    expressionAttributeValues[':liveUrl'] = input.liveUrl;
  }

  if (input.githubUrl !== undefined) {
    updateExpressions.push('#githubUrl = :githubUrl');
    expressionAttributeNames['#githubUrl'] = 'githubUrl';
    expressionAttributeValues[':githubUrl'] = input.githubUrl;
  }

  if (input.logoPath !== undefined) {
    updateExpressions.push('#logoPath = :logoPath');
    expressionAttributeNames['#logoPath'] = 'logoPath';
    expressionAttributeValues[':logoPath'] = input.logoPath;
  }

  // Always update dateUpdated
  updateExpressions.push('#dateUpdated = :dateUpdated');
  expressionAttributeNames['#dateUpdated'] = 'dateUpdated';
  expressionAttributeValues[':dateUpdated'] = Date.now();

  if (updateExpressions.length === 1) {
    return createResponse(400, { error: 'No fields to update' });
  }

  await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  }));

  return createResponse(200, { 
    message: 'Project updated successfully',
    id 
  });
}

// Delete project
async function deleteProject(id: string): Promise<APIGatewayProxyResult> {
  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));

  return createResponse(200, { 
    message: 'Project deleted successfully',
    id 
  });
}
