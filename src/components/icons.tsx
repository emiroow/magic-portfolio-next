import {
  FaDownload,
  FaFigma,
  FaFileAlt,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaVideo,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiGlobeAlt } from "react-icons/hi";
import { MdApi, MdWeb } from "react-icons/md";
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
    case "demo":
      return <MdWeb />;
    case "figma":
      return <FaFigma />;
    case "website":
      return <HiGlobeAlt />;
    case "api":
      return <MdApi />;
    case "docs":
      return <FaFileAlt />;
    case "video":
      return <FaVideo />;
    case "download":
      return <FaDownload />;
    default:
      return null;
  }
};
