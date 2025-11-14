"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface ResumeCardProps {
  logoUrl?: string;
  altText?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  isExpanded?: boolean;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  onDelete,
  onEdit,
  isExpanded: isExpandedOuter,
  onToggle,
}: ResumeCardProps) => {
  const [isExpandedInner, setIsExpandedInner] = React.useState(false);
  const isExpanded = isExpandedOuter || isExpandedInner;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      if (isExpandedOuter) onToggle?.();
      else setIsExpandedInner(!isExpandedInner);
    }
  };

  const locale = useLocale();

  return (
    <div className="block cursor-pointer w-full">
      <Card className="flex items-center w-full">
        <Link
          href={href || "#"}
          className="flex items-center w-full"
          onClick={handleClick}
        >
          {logoUrl && (
            <div className="flex-none">
              <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
                <AvatarImage
                  src={logoUrl}
                  alt={altText}
                  className="object-contain"
                />
                <AvatarFallback>{altText && altText[0]}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="flex-grow ms-4 items-center flex-col group">
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3
                  className={`${
                    !description && "hover:underline"
                  } inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm`}
                >
                  {title}
                  {badges && (
                    <span className="inline-flex">
                      {badges.map((badge, index) => (
                        <Badge
                          variant="secondary"
                          className="align-middle text-xs"
                          key={index}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  )}
                  {description && (
                    <ChevronRightIcon
                      className={cn(
                        "size-4 translate-x-0  mr-2 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                        locale === "fa"
                          ? isExpanded
                            ? "rotate-90"
                            : "rotate-180"
                          : isExpanded
                          ? "rotate-90"
                          : "rotate-0"
                      )}
                    />
                  )}
                </h3>
                <div
                  className={`text-[11px] sm:text-xs font-normal text-muted-foreground mt-5 ${
                    locale === "en" ? "mr-3" : "ml-3"
                  } `}
                >
                  {period}
                </div>
              </div>
              {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
            </CardHeader>
            {description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  height: isExpanded ? "auto" : 0,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-2 text-xs sm:text-sm"
              >
                {description}
              </motion.div>
            )}
          </div>
        </Link>
        <div
          className={`flex flex-col ${
            isExpanded ? "gap-4" : "gap-3"
          } z-50 transition-discrete transition-all delay-150 duration-300`}
        >
          {!!onEdit && (
            <button
              type="button"
              className=""
              onClick={() => {
                onEdit?.();
              }}
            >
              <FiEdit2 className="hover:text-green-600 text-sm" />
            </button>
          )}
          {!!onDelete && (
            <button
              type="button"
              className=""
              onClick={() => {
                onDelete?.();
              }}
            >
              <MdOutlineDeleteOutline className="hover:text-red-600 text-md" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};
