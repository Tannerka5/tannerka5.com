import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../sanitize-html';

describe('sanitizeHtml', () => {
    it('strips script tags entirely', () => {
        expect(sanitizeHtml('<script>alert(1)</script><p>hello</p>')).toBe('<p>hello</p>');
    });

    it('strips event handler attributes like onerror', () => {
        expect(sanitizeHtml('<img src=x onerror=alert(1)>')).toBe('<img src="x">');
    });

    it('strips javascript: URIs from links', () => {
        expect(sanitizeHtml('<a href="javascript:alert(1)">click</a>')).toBe('<a>click</a>');
    });

    it('strips iframe tags', () => {
        expect(sanitizeHtml('<iframe src="evil.com"></iframe><p>safe</p>')).toBe('<p>safe</p>');
    });

    it('strips onclick and other inline handlers', () => {
        expect(sanitizeHtml('<p onclick="alert(1)">clickable</p>')).toBe('<p>clickable</p>');
    });

    it('allows the toolbar-supported tags through unchanged', () => {
        const safe =
            '<h1>Title</h1><p><strong>bold</strong> <em>italic</em> <u>underline</u></p>' +
            '<ul><li>item</li></ul><blockquote>quote</blockquote>';
        expect(sanitizeHtml(safe)).toBe(safe);
    });

    it('allows <b>/<i>/<div> through unchanged (what execCommand and contentEditable actually emit)', () => {
        const safe = '<div><b>bold</b> <i>italic</i></div>';
        expect(sanitizeHtml(safe)).toBe(safe);
    });

    it('allows images with src/alt but strips disallowed attributes', () => {
        expect(sanitizeHtml('<img src="/a.png" alt="A" data-evil="x">')).toBe(
            '<img src="/a.png" alt="A">'
        );
    });
});
