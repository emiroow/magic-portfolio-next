import { createAdminCrud } from '@/lib/crud';
import { educationSchema, forUpdate } from '@/lib/validations';
import { educationModel } from '@/models/education';

// Admin CRUD for education entries (guarded by session + zod validation).
export const { GET, POST, PUT, DELETE } = createAdminCrud({
  model: educationModel,
  createSchema: educationSchema,
  updateSchema: forUpdate(educationSchema),
  sort: { start: -1 },
});
