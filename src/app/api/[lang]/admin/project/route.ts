import { createAdminCrud } from '@/lib/crud';
import { forUpdate, projectSchema } from '@/lib/validations';
import { projectModel } from '@/models/project';

// Admin CRUD for projects (guarded by session + zod validation).
export const { GET, POST, PUT, DELETE } = createAdminCrud({
  model: projectModel,
  createSchema: projectSchema,
  updateSchema: forUpdate(projectSchema),
  sort: { createdAt: -1 },
});
