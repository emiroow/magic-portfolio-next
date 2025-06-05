export const apiEndPoint = process.env.NEXT_PUBLIC_API_BASE_URL;
import { HiOutlineHome } from "react-icons/hi";
import { LuNotebook } from "react-icons/lu";

export const NavbarRoutes = [
  { href: "/", icon: HiOutlineHome, label: "Home" },
  { href: "/blog", icon: LuNotebook, label: "Blog" },
];
