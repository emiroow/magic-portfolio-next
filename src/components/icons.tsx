import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
export type IconProps = React.HTMLAttributes<SVGElement>;

export const iconDecider = (name: string) => {
  switch (name) {
    case "linkedin":
      return <FaLinkedin />;
    case "github":
      return <FaGithub />;
    case "instagram":
      return <FaInstagram />;
    case "telegram":
      return <FaTelegram />;
    case "youtube":
      return <FaYoutube />;
    case "whatsapp":
      return <FaWhatsapp />;
    case "x":
      return <FaXTwitter />;
    default:
      return null;
  }
};
