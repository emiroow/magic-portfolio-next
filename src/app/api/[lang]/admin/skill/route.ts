import { createAdminCrud } from '@/lib/crud';
import { forUpdate, skillSchema } from '@/lib/validations';
import { skillModel } from '@/models/skill';

// Admin CRUD for skills (guarded by session + zod validation).
export const { GET, POST, PUT, DELETE } = createAdminCrud({
  model: skillModel,
  createSchema: skillSchema,
  updateSchema: forUpdate(skillSchema),
  sort: { name: 1 },
});
