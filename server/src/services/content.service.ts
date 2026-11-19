import { v4 as uuidv4 } from 'uuid';
import type { ContentRepository, ContentRecord } from '../repositories/content.repository';
import { NotFoundError, ConflictError, ValidationError } from '../lib/errors';
import { parseObjectBody, deriveSlug, pickUpdatableFields } from '../validation/content';
import type { ReorderItem } from '../types';

export interface ContentServiceOptions<T extends ContentRecord> {
  repository: ContentRepository<T>;
  notFoundMessage: string;
  updatableFields: readonly string[];
}

// One generic implementation of list/get/create/update/delete/reorder shared
// by both projects and blog posts — the two resources differ only in their
// table, slug index, and which fields are updatable (see config/resources.ts).
export class ContentService<T extends ContentRecord> {
  constructor(private readonly options: ContentServiceOptions<T>) {}

  async list(): Promise<T[]> {
    const items = await this.options.repository.listAll();
    return [...items].sort((itemA, itemB) => (itemA.order ?? 0) - (itemB.order ?? 0));
  }

  async getBySlug(slug: string): Promise<T> {
    const item = await this.options.repository.findBySlug(slug);
    if (!item) {
      throw new NotFoundError(this.options.notFoundMessage);
    }
    return item;
  }

  async create(rawBody: unknown): Promise<T> {
    const input = parseObjectBody(rawBody);
    const slug = deriveSlug(input);

    const existing = await this.options.repository.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`An item with slug "${slug}" already exists`);
    }

    const now = Date.now();
    // Trust boundary: required fields (title/slug) are validated above; the
    // rest of the shallow-validated input is trusted as-is (single-admin-
    // authored content, matches the rest of this resource's validation depth).
    const item = {
      ...input,
      id: uuidv4(),
      slug,
      order: typeof input.order === 'number' ? input.order : now,
      createdAt: now,
      updatedAt: now,
    } as unknown as T;

    await this.options.repository.put(item);
    return item;
  }

  async update(slug: string, rawBody: unknown): Promise<void> {
    const input = parseObjectBody(rawBody);
    const existing = await this.options.repository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError(this.options.notFoundMessage);
    }

    const fields = pickUpdatableFields(input, this.options.updatableFields);
    if (Object.keys(fields).length === 0) {
      throw new ValidationError('No fields to update');
    }
    fields.updatedAt = Date.now();

    await this.options.repository.updateFields(existing.id, fields);
  }

  async remove(slug: string): Promise<void> {
    const existing = await this.options.repository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError(this.options.notFoundMessage);
    }
    await this.options.repository.deleteById(existing.id);
  }

  async reorder(items: ReorderItem[]): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.options.repository.updateFields(item.id, { order: item.order, updatedAt: Date.now() })
      )
    );
  }
}
