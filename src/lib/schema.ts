import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string(),
});

export type Post = z.infer<typeof postSchema>;
