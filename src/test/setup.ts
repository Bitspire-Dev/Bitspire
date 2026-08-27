import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';

afterEach(() => {
  cleanup();
});
