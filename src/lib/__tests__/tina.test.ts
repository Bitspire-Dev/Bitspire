import { describe, it, expect, vi } from 'vitest';
import { tinaQueryWithRetry, getPage, getBlogPost, getProject } from '../tina';
import client from '@tina/__generated__/client';

vi.mock('@tina/__generated__/client', () => ({
  default: {
    queries: {
      page: vi.fn(),
      blog: vi.fn(),
      project: vi.fn(),
      blogConnection: vi.fn(),
      projectConnection: vi.fn(),
    },
  },
}));

describe('tinaQueryWithRetry', () => {
  it('returns the query result on the first attempt', async () => {
    const query = vi.fn().mockResolvedValue('result');
    const result = await tinaQueryWithRetry(query, { retries: 2, delayMs: 0 });
    expect(result).toBe('result');
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('retries the query when it fails', async () => {
    const query = vi
      .fn()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockResolvedValueOnce('result');
    const result = await tinaQueryWithRetry(query, { retries: 2, delayMs: 0 });
    expect(result).toBe('result');
    expect(query).toHaveBeenCalledTimes(2);
  });

  it('throws the last error after exhausting retries', async () => {
    const query = vi.fn().mockRejectedValue(new Error('persistent failure'));
    await expect(tinaQueryWithRetry(query, { retries: 1, delayMs: 0 })).rejects.toThrow(
      'persistent failure'
    );
    expect(query).toHaveBeenCalledTimes(2);
  });
});

describe('getPage', () => {
  it('fetches a page by relative path', async () => {
    const response = { data: { page: { id: '1' } } };
    vi.mocked(client.queries.page).mockResolvedValue(response as never);
    const result = await getPage('pl/home.md');
    expect(client.queries.page).toHaveBeenCalledWith({ relativePath: 'pl/home.md' });
    expect(result).toEqual(response);
  });
});

describe('getBlogPost', () => {
  it('fetches a blog post by relative path', async () => {
    const response = { data: { blog: { id: '1' } } };
    vi.mocked(client.queries.blog).mockResolvedValue(response as never);
    const result = await getBlogPost('pl/post.md');
    expect(client.queries.blog).toHaveBeenCalledWith({ relativePath: 'pl/post.md' });
    expect(result).toEqual(response);
  });
});

describe('getProject', () => {
  it('fetches a project by relative path', async () => {
    const response = { data: { project: { id: '1' } } };
    vi.mocked(client.queries.project).mockResolvedValue(response as never);
    const result = await getProject('pl/websites/project.md');
    expect(client.queries.project).toHaveBeenCalledWith({ relativePath: 'pl/websites/project.md' });
    expect(result).toEqual(response);
  });
});
