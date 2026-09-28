import { createAdminCrud } from '@/lib/crud';
import { blogSchema, forUpdate } from '@/lib/validations';
import { blogModel } from '@/models/blog';

// Admin CRUD for blog posts (guarded by session + zod validation).
export const { GET, POST, PUT, DELETE } = createAdminCrud({
  model: blogModel,
  createSchema: blogSchema,
  updateSchema: forUpdate(blogSchema),
  sort: { createdAt: -1 },
});
