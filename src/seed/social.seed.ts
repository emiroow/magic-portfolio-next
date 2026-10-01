import { socialModel } from '@/models/social';
import { withBothLangs, type Persona } from './personas/types';

/** Contact channels for the floating dock and the contact section. */
export const seedSocialData = async (persona: Persona) => {
  const inserted = await socialModel.insertMany(withBothLangs(persona.socials));
  return inserted.length;
};
