import { describe, it, expect, beforeEach } from 'vitest';
import { ContentService } from '../content.service';
import { NotFoundError, ConflictError, ValidationError } from '../../lib/errors';
import type { ContentRecord } from '../../repositories/content.repository';

interface TestItem extends ContentRecord {
  title: string;
}

// A minimal in-memory stand-in for ContentRepository<T> -- since the service
// depends on the repository's public shape (not the AWS SDK directly), no
// DynamoDB mocking is needed to unit test the business logic.
class FakeContentRepository {
  items: TestItem[] = [];

  async listAll(): Promise<TestItem[]> {
    return this.items;
  }

  async findBySlug(slug: string): Promise<TestItem | null> {
    return this.items.find((item) => item.slug === slug) || null;
  }

  async put(item: TestItem): Promise<void> {
    this.items.push(item);
  }

  async updateFields(id: string, fields: Record<string, unknown>): Promise<void> {
    const item = this.items.find((entry) => entry.id === id);
    if (item) Object.assign(item, fields);
  }

  async deleteById(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

describe('ContentService', () => {
  let repository: FakeContentRepository;
  let service: ContentService<TestItem>;

  beforeEach(() => {
    repository = new FakeContentRepository();
    service = new ContentService<TestItem>({
      repository: repository as never,
      notFoundMessage: 'Item not found',
      updatableFields: ['title', 'order'],
    });
  });

  describe('create', () => {
    it('creates an item with a derived slug, id, and timestamps', async () => {
      const created = await service.create({ title: 'My Item' });

      expect(created.slug).toBe('my-item');
      expect(created.id).toBeTruthy();
      expect(created.createdAt).toBeTypeOf('number');
      expect(created.updatedAt).toBe(created.createdAt);
    });

    it('rejects a duplicate slug with ConflictError', async () => {
      await service.create({ title: 'Existing', slug: 'existing' });

      await expect(service.create({ title: 'Existing Again', slug: 'existing' })).rejects.toThrow(
        ConflictError
      );
    });

    it('rejects a body with no title and no slug', async () => {
      await expect(service.create({})).rejects.toThrow(ValidationError);
    });
  });

  describe('list', () => {
    it('sorts items by order', async () => {
      await service.create({ title: 'Second', order: 2 });
      await service.create({ title: 'First', order: 1 });

      const items = await service.list();

      expect(items.map((item) => item.title)).toEqual(['First', 'Second']);
    });
  });

  describe('getBySlug', () => {
    it('throws NotFoundError for a missing slug', async () => {
      await expect(service.getBySlug('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('only writes allowlisted fields (mass-assignment fix)', async () => {
      const created = await service.create({ title: 'Original', slug: 'my-slug' });

      await service.update('my-slug', { title: 'Updated', id: 'attacker-id', slug: 'new-slug' });

      const stored = await repository.findBySlug('my-slug');
      expect(stored?.title).toBe('Updated');
      expect(stored?.id).toBe(created.id); // id was NOT overwritten
      expect(stored?.slug).toBe('my-slug'); // slug was NOT overwritten
    });

    it('throws NotFoundError for a missing slug', async () => {
      await expect(service.update('missing', { title: 'x' })).rejects.toThrow(NotFoundError);
    });

    it('throws ValidationError when no updatable fields are provided', async () => {
      await service.create({ title: 'Original', slug: 'my-slug' });
      await expect(service.update('my-slug', { unrelatedField: 'x' })).rejects.toThrow(
        'No fields to update'
      );
    });
  });

  describe('remove', () => {
    it('deletes the item and throws NotFoundError if called again', async () => {
      await service.create({ title: 'To delete', slug: 'to-delete' });

      await service.remove('to-delete');

      await expect(service.remove('to-delete')).rejects.toThrow(NotFoundError);
    });
  });

  describe('reorder', () => {
    it('updates the order field on each referenced item', async () => {
      const first = await service.create({ title: 'First', slug: 'first' });
      const second = await service.create({ title: 'Second', slug: 'second' });

      await service.reorder([
        { id: first.id, order: 5 },
        { id: second.id, order: 1 },
      ]);

      const items = await service.list();
      expect(items.map((item) => item.title)).toEqual(['Second', 'First']);
    });
  });
});
