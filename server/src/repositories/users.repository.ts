import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { User } from '../types';

export class UsersRepository {
  constructor(
    private readonly docClient: DynamoDBDocumentClient,
    private readonly tableName: string,
    private readonly usernameIndexName: string
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.usernameIndexName,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: { ':username': username },
      })
    );
    return (result.Items?.[0] as User) || null;
  }

  async create(user: User): Promise<void> {
    await this.docClient.send(new PutCommand({ TableName: this.tableName, Item: user }));
  }
}
