import { ValidationError } from '../lib/errors';

export function parseObjectBody(raw: unknown): Record<string, unknown> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new ValidationError('Request body must be a JSON object');
  }
  return raw as Record<string, unknown>;
}

export function requireNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${field} is required`);
  }
  return value;
}

export function deriveSlug(input: Record<string, unknown>): string {
  if (typeof input.slug === 'string' && input.slug.trim() !== '') {
    return input.slug;
  }
  const title = requireNonEmptyString(input.title, 'title');
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Fields not in `updatableFields` are silently dropped, closing the mass-
// assignment gap where updates used to write every client-sent field verbatim.
export function pickUpdatableFields(
  input: Record<string, unknown>,
  updatableFields: readonly string[]
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const field of updatableFields) {
    if (input[field] !== undefined) {
      picked[field] = input[field];
    }
  }
  return picked;
}

export function validateReorderInput(raw: unknown): { id: string; order: number }[] {
  const input = parseObjectBody(raw);
  if (!Array.isArray(input.items)) {
    throw new ValidationError('items must be an array');
  }
  return input.items.map((item, index) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as Record<string, unknown>).id !== 'string' ||
      typeof (item as Record<string, unknown>).order !== 'number'
    ) {
      throw new ValidationError(`items[${index}] must have a string id and numeric order`);
    }
    const entry = item as { id: string; order: number };
    return { id: entry.id, order: entry.order };
  });
}
