import { describe, it, expect } from 'vitest';
import { toSafeJsonLd } from '../json-ld';

describe('toSafeJsonLd', () => {
    it('produces valid JSON for a normal payload', () => {
        const data = { title: 'Hello World' };
        expect(JSON.parse(toSafeJsonLd(data))).toEqual(data);
    });

    it('escapes </script> so it cannot break out of the surrounding script tag', () => {
        const malicious = { title: 'Evil</script><script>alert(1)</script>' };
        const output = toSafeJsonLd(malicious);

        expect(output).not.toContain('</script>');
        expect(JSON.parse(output)).toEqual(malicious);
    });

    it('escapes every "<" character, not just the first', () => {
        const output = toSafeJsonLd({ a: '<<<' });
        expect(output).not.toContain('<');
    });
});
