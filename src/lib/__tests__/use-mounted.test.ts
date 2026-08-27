import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMounted } from '../use-mounted';

describe('useMounted', () => {
  it('returns true after the component mounts', async () => {
    const { result } = renderHook(() => useMounted());
    await waitFor(() => expect(result.current).toBe(true));
  });
});
