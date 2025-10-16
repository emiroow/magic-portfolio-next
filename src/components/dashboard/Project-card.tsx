"use client";
import { iconDecider } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { ConfirmDialog } from "../ui/confirm-dialog";

interface Link {
  type: string;
  href: string;
  icon: string;
}

interface Project {
  _id: string;
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: Link[];
  image: string;
  lang: string;
}

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  isDeleting,
}: ProjectItemProps) => {
  const t = useTranslations("dashboard.projects");
  const tBase = useTranslations("dashboard");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <Card className="relative transition-shadow hover:shadow-md bg-card border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1 flex-1 min-w-0 p-3">
          <CardTitle className="text-base font-semibold">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-primary hover:text-primary/80 transition-colors"
            >
              {project.title}
            </a>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{project.dates}</p>
        </div>
        <div className="flex flex-shrink-0 ml-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(project)}
            title={t("edit")}
          >
            <MdEdit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={() => setOpen(true)}
            disabled={isDeleting}
            title={t("delete")}
          >
            {isDeleting ? (
              <Loading size="sm" />
            ) : (
              <MdDelete className="h-4 w-4" />
            )}
          </Button>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            title={tBase("confirmTitle")}
            confirmText={t("delete")}
            cancelText={t("cancel")}
            danger
            dir={locale === "fa" ? "rtl" : "ltr"}
            locale={locale}
            itemName={project.title}
            onConfirm={() => {
              setOpen(false);
              onDelete(project._id);
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:px-3 sm:pb-3 gap-2">
          {project.image && (
            <div className="flex-shrink-0">
              <Image
                src={project.image}
                alt={project.title}
                width={100}
                height={100}
                className="object-cover rounded-md border w-full h-auto sm:w-[100px] sm:h-[100px]"
              />
            </div>
          )}
          <div className="flex-1 space-y-3 min-w-0 max-sm:p-2">
            <p className="text-sm text-muted-foreground leading-relaxed ">
              {project.description}
            </p>

            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech: string, techIndex: number) => (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {project.active && (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  {t("active")}
                </Badge>
              )}

              {project.links?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
                      title={link.type}
                    >
                      {iconDecider(link.icon)}
                      {link.type}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
