import { describe, it, expect } from 'vitest';
import {
  parseObjectBody,
  requireNonEmptyString,
  deriveSlug,
  pickUpdatableFields,
  validateReorderInput,
} from '../content';
import { ValidationError } from '../../lib/errors';

describe('parseObjectBody', () => {
  it('returns the object when given a plain object', () => {
    // Arrange
    const input = { title: 'Hello' };

    // Act
    const result = parseObjectBody(input);

    // Assert
    expect(result).toBe(input);
  });

  it.each([null, undefined, 'a string', 42, ['array', 'not', 'object']])(
    'throws ValidationError for %s',
    (invalidInput) => {
      expect(() => parseObjectBody(invalidInput)).toThrow(ValidationError);
    }
  );
});

describe('requireNonEmptyString', () => {
  it('returns the string when non-empty', () => {
    expect(requireNonEmptyString('hello', 'title')).toBe('hello');
  });

  it.each([undefined, null, '', '   ', 42, {}])(
    'throws ValidationError with the field name for %s',
    (invalidValue) => {
      expect(() => requireNonEmptyString(invalidValue, 'title')).toThrow('title is required');
    }
  );
});

describe('deriveSlug', () => {
  it('uses the provided slug when present', () => {
    expect(deriveSlug({ title: 'My Project', slug: 'custom-slug' })).toBe('custom-slug');
  });

  it('derives a slug from the title when slug is absent', () => {
    expect(deriveSlug({ title: 'My Cool Project!' })).toBe('my-cool-project-');
  });

  it('throws ValidationError when both slug and title are missing', () => {
    expect(() => deriveSlug({})).toThrow('title is required');
  });

  it('falls back to the title when slug is an empty string', () => {
    expect(deriveSlug({ title: 'Fallback Title', slug: '   ' })).toBe('fallback-title');
  });
});

describe('pickUpdatableFields', () => {
  const updatableFields = ['title', 'order'] as const;

  it('keeps only the allowlisted fields present on the input', () => {
    // Arrange: id/slug are NOT in the allowlist -- this is the mass-assignment fix
    const input = { title: 'New title', id: 'attacker-controlled', slug: 'attacker-slug' };

    // Act
    const result = pickUpdatableFields(input, updatableFields);

    // Assert
    expect(result).toEqual({ title: 'New title' });
    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('slug');
  });

  it('omits allowlisted fields the input did not provide', () => {
    const result = pickUpdatableFields({ title: 'Only title' }, updatableFields);
    expect(result).toEqual({ title: 'Only title' });
  });

  it('returns an empty object when no updatable fields are present', () => {
    const result = pickUpdatableFields({ unrelatedField: 'x' }, updatableFields);
    expect(result).toEqual({});
  });
});

describe('validateReorderInput', () => {
  it('returns a typed array for valid input', () => {
    const result = validateReorderInput({
      items: [
        { id: 'a', order: 0 },
        { id: 'b', order: 1 },
      ],
    });
    expect(result).toEqual([
      { id: 'a', order: 0 },
      { id: 'b', order: 1 },
    ]);
  });

  it('throws ValidationError when items is missing', () => {
    expect(() => validateReorderInput({})).toThrow('items must be an array');
  });

  it('throws ValidationError when an item is missing id or order', () => {
    expect(() => validateReorderInput({ items: [{ id: 'a' }] })).toThrow(
      'items[0] must have a string id and numeric order'
    );
  });
});
