import { skillModel } from '@/models/skill';

/** Demo skill badges (shared across both locales). */
const SKILLS = ['TypeScript', 'React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'shadcn/ui', 'Git', 'Docker', 'REST APIs'];

export const seedSkillsData = async () => {
  const data = SKILLS.flatMap(name => [
    { name, lang: 'en' },
    { name, lang: 'fa' },
  ]);

  await skillModel.create(data);
};
