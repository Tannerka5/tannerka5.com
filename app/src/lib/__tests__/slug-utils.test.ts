import { describe, it, expect } from 'vitest';
import { slugify } from '../slug-utils';

describe('slugify', () => {
    it('lowercases and hyphenates spaces', () => {
        expect(slugify('My Cool Project')).toBe('my-cool-project');
    });

    it('strips non-alphanumeric characters', () => {
        expect(slugify('Hello, World!')).toBe('hello-world-');
    });

    it('collapses consecutive separators into a single hyphen', () => {
        expect(slugify('A   B---C')).toBe('a-b-c');
    });
});
