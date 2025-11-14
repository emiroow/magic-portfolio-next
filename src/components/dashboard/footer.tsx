"use client";

import { DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavbarRoutes } from "@/constants/global";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FaPowerOff } from "react-icons/fa";
import { Dock } from "../magicui/dock";
import { ModeToggle } from "../mode-toggle";
import ThemeToggle from "../theme-toggle";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
const Footer = () => {
  const locale = useLocale();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock
        magnification={60}
        distance={50}
        className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] "
      >
        {NavbarRoutes(locale)?.map((item, index) => (
          <DockIcon key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" })
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" })
                )}
              >
                <FaPowerOff />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ThemeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Language</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
};

export default Footer;
