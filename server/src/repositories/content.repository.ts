import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { NotFoundError } from '../lib/errors';

export interface ContentRecord {
  id: string;
  slug: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

// Generic DynamoDB access for a single-table "slug-indexed content" resource
// (projects, blog posts). One implementation used by both instead of two
// ~95% duplicated CRUD blocks.
export class ContentRepository<T extends ContentRecord> {
  constructor(
    private readonly docClient: DynamoDBDocumentClient,
    private readonly tableName: string,
    private readonly slugIndexName: string
  ) {}

  async listAll(): Promise<T[]> {
    const result = await this.docClient.send(new ScanCommand({ TableName: this.tableName }));
    return (result.Items || []) as T[];
  }

  async findBySlug(slug: string): Promise<T | null> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.slugIndexName,
        KeyConditionExpression: 'slug = :slug',
        ExpressionAttributeValues: { ':slug': slug },
      })
    );
    return (result.Items?.[0] as T) || null;
  }

  async put(item: T): Promise<void> {
    await this.docClient.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  async updateFields(id: string, fields: Record<string, unknown>): Promise<void> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    Object.entries(fields).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    try {
      await this.docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { id },
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          // Without this, UpdateCommand upserts on a missing id -- a reorder
          // referencing an already-deleted item would silently create a
          // corrupt row with only {id, ...fields} instead of failing.
          ConditionExpression: 'attribute_exists(id)',
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        })
      );
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new NotFoundError('Item not found');
      }
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }
}
