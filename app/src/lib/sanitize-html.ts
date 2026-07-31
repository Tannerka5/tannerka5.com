import DOMPurify from 'isomorphic-dompurify';

// Matches exactly what SimpleRichTextEditor's toolbar can produce — headings,
// basic text formatting, lists, links, and images. Anything else (script,
// iframe, svg, style, event handler attributes, etc.) is stripped.
const ALLOWED_TAGS = [
    'h1',
    'h2',
    'h3',
    'p',
    'strong',
    'em',
    'u',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'br',
    'blockquote',
];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt'];

export function sanitizeHtml(dirty: string): string {
    // DOMPurify allows data-*/aria-* attributes through by default regardless
    // of ALLOWED_ATTR -- disable both so the allowlist above is exhaustive.
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
        ALLOW_ARIA_ATTR: false,
    });
}
