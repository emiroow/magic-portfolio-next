export const apiEndPoint = process.env.NEXT_PUBLIC_API_BASE_URL;
import { HiOutlineHome } from "react-icons/hi";
import { LuNotebook } from "react-icons/lu";

export const NavbarRoutes = (basePath: string = "") => {
  const prefix = basePath ? `/${basePath.replace(/^\/+|\/+$/g, "")}` : "";
  return [
    { href: prefix || "/", icon: HiOutlineHome, label: "Home" },
    { href: `${prefix}/blog`, icon: LuNotebook, label: "Blog" },
  ];
};
