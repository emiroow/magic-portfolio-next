import { workModel } from '@/models/work';
import { withBothLangs, type Persona } from './personas/types';

/** Career history, newest role first, both locales. Returns the inserted count. */
export const seedWorkData = async (persona: Persona) => {
  const inserted = await workModel.insertMany(withBothLangs(persona.works));
  return inserted.length;
};
