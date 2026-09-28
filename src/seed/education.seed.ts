import { educationModel } from '@/models/education';

/** Demo education entries for both locales. */
export const seedEducationData = async () => {
  const educationData = [
    {
      school: 'University of Tehran',
      degree: 'B.Sc. in Computer Science',
      href: 'https://example.edu',
      logoUrl: '',
      start: '2016/09',
      end: '2020/07',
      lang: 'en',
    },
    {
      school: 'دانشگاه تهران',
      degree: 'کارشناسی مهندسی کامپیوتر',
      href: 'https://example.edu',
      logoUrl: '',
      start: '1395/06',
      end: '1399/04',
      lang: 'fa',
    },
  ];

  await educationModel.create(educationData);
};
