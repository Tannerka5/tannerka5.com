import { describe, it, expect, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { ContentRepository, type ContentRecord } from '../content.repository';
import { NotFoundError } from '../../lib/errors';

interface TestItem extends ContentRecord {
  title: string;
}

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('ContentRepository', () => {
  let repository: ContentRepository<TestItem>;

  beforeEach(() => {
    ddbMock.reset();
    repository = new ContentRepository<TestItem>(
      ddbMock as unknown as DynamoDBDocumentClient,
      'test-table',
      'slug-index'
    );
  });

  it('listAll scans the configured table', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [{ id: '1', slug: 'a', title: 'A' }] });

    const items = await repository.listAll();

    expect(items).toHaveLength(1);
    expect(ddbMock.commandCalls(ScanCommand)[0].args[0].input.TableName).toBe('test-table');
  });

  it('findBySlug queries the slug index and returns the first match', async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [{ id: '1', slug: 'a', title: 'A' }] });

    const item = await repository.findBySlug('a');

    expect(item?.id).toBe('1');
    const call = ddbMock.commandCalls(QueryCommand)[0].args[0].input;
    expect(call.IndexName).toBe('slug-index');
    expect(call.ExpressionAttributeValues).toEqual({ ':slug': 'a' });
  });

  it('findBySlug returns null when nothing matches', async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [] });

    expect(await repository.findBySlug('missing')).toBeNull();
  });

  it('put sends the item via PutCommand', async () => {
    ddbMock.on(PutCommand).resolves({});
    const item: TestItem = { id: '1', slug: 'a', title: 'A', order: 0, createdAt: 1, updatedAt: 1 };

    await repository.put(item);

    expect(ddbMock.commandCalls(PutCommand)[0].args[0].input.Item).toEqual(item);
  });

  it('updateFields builds ExpressionAttributeNames to avoid DynamoDB reserved words', async () => {
    ddbMock.on(UpdateCommand).resolves({});

    await repository.updateFields('1', { order: 5 });

    const call = ddbMock.commandCalls(UpdateCommand)[0].args[0].input;
    expect(call.UpdateExpression).toBe('SET #order = :order');
    expect(call.ExpressionAttributeNames).toEqual({ '#order': 'order' });
    expect(call.ExpressionAttributeValues).toEqual({ ':order': 5 });
    expect(call.ConditionExpression).toBe('attribute_exists(id)');
  });

  it('updateFields throws NotFoundError instead of upserting when the id does not exist', async () => {
    ddbMock.on(UpdateCommand).rejects(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} })
    );

    await expect(repository.updateFields('missing', { order: 5 })).rejects.toThrow(NotFoundError);
  });

  it('deleteById sends the id as the key', async () => {
    ddbMock.on(DeleteCommand).resolves({});

    await repository.deleteById('1');

    expect(ddbMock.commandCalls(DeleteCommand)[0].args[0].input.Key).toEqual({ id: '1' });
  });
});
