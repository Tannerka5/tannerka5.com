// JSON.stringify does not escape "<", so a title/tag containing a literal
// "</script>" could break out of a <script type="application/ld+json"> tag.
// Escaping "<" as its unicode sequence keeps the JSON valid while making
// that breakout impossible.
export function toSafeJsonLd(data: unknown): string {
    return JSON.stringify(data).replace(/</g, '\\u003c');
}
