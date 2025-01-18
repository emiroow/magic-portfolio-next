interface Link {
  type: string;
  href: string;
  icon: string;
}

interface IProduct {
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: Link[];
  image: string;
}
