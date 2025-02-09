interface Link {
  type: string;
  href: string;
  icon: string;
}

interface IProject {
  title: string;
  href: string;
  video: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: Link[];
  image: string;
  lang: String;
}
