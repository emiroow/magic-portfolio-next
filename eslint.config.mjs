import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/**
 * Flat ESLint config: Next.js core-web-vitals + TypeScript rules.
 */
const config = [
  { ignores: ['.next/**', 'next-env.d.ts', 'out/**', 'public/**', 'node_modules/**'] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Allow omitting known props via rest siblings (e.g. `size` in DockIcon).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
];

export default config;
