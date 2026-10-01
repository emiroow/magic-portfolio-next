import { educationModel } from '@/models/education';
import { withBothLangs, type Persona } from './personas/types';

/** Study history — degrees, or a degree plus a certification for a designer. */
export const seedEducationData = async (persona: Persona) => {
  const inserted = await educationModel.insertMany(withBothLangs(persona.educations));
  return inserted.length;
};
