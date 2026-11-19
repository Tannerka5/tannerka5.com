import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import astro from 'eslint-plugin-astro';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...astro.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                fetch: 'readonly',
                XMLHttpRequest: 'readonly',
                crypto: 'readonly',
                MutationObserver: 'readonly',
                MediaQueryListEvent: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLDivElement: 'readonly',
                React: 'readonly',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off', // not needed with the modern JSX transform
            'react/prop-types': 'off', // TypeScript interfaces already enforce this at compile time
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'error',
            // fetch-on-mount is a standard, deliberate pattern here (no data-fetching
            // library in this project); this rule is new/experimental enough to warn on rather than block.
            'react-hooks/set-state-in-effect': 'warn',
            // Known gap: ProjectEditor.tsx has ~17 <label>/<input> pairs without
            // htmlFor/id links, pre-dating this lint setup. Tracked as a warning
            // rather than fixed en masse here -- worth its own dedicated pass.
            'jsx-a11y/label-has-associated-control': 'warn',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
    prettierConfig,
    {
        ignores: ['dist/**', 'node_modules/**', '.astro/**', 'public/**'],
    }
);
