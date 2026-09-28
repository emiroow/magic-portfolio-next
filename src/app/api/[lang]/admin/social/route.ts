import { createAdminCrud } from '@/lib/crud';
import { forUpdate, socialSchema } from '@/lib/validations';
import { socialModel } from '@/models/social';

// Admin CRUD for social profiles (guarded by session + zod validation).
export const { GET, POST, PUT, DELETE } = createAdminCrud({
  model: socialModel,
  createSchema: socialSchema,
  updateSchema: forUpdate(socialSchema),
});
