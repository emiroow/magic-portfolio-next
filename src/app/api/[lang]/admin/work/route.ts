import { createAdminCrud } from '@/lib/crud';
import { forUpdate, workSchema } from '@/lib/validations';
import { workModel } from '@/models/work';

// Admin CRUD for work experiences (guarded by session + zod validation).
export const { GET, POST, PUT, DELETE } = createAdminCrud({
  model: workModel,
  createSchema: workSchema,
  updateSchema: forUpdate(workSchema),
  sort: { start: -1 },
});
