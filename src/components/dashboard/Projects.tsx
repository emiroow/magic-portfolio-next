"use client";
import { Badge } from "@/components/ui/badge";
import useProjects from "@/hooks/dashboard/useProjects";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import BlurFade from "../magicui/blur-fade";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ProjectCard from "./Project-card";

const Projects = () => {
  const t = useTranslations("dashboard.projects");
  const tBase = useTranslations("");
  const [newTech, setNewTech] = useState("");
  const [newLink, setNewLink] = useState({ type: "", href: "", icon: "" });
  const BLUR_FADE_DELAY = 0.04;

  // لیست آیکون‌های موجود
  const availableIcons = [
    { value: "github", label: "GitHub", emoji: "🔗" },
    { value: "demo", label: "Demo", emoji: "🌐" },
    { value: "figma", label: "Figma", emoji: "🎨" },
    { value: "website", label: "Website", emoji: "🌍" },
    { value: "api", label: "API", emoji: "⚡" },
    { value: "docs", label: "Documentation", emoji: "📚" },
    { value: "video", label: "Video", emoji: "🎥" },
    { value: "download", label: "Download", emoji: "⬇️" },
  ];

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isDirty },
    onsubmit,
    btnLoading,
    isLoading,
    projects,
    isEdit,
    setIsEdit,
    deleteProject,
    isDeletingProject,
    editProject,
    uploadProjectImage,
    deleteUploadedProjectImage,
    imageShowFromUrlLoading,
    setImageShowFromUrlLoading,
    fileInputRef,
    resetMutation,
  } = useProjects();

  if (isLoading) return <Loading className="h-[50vh]" />;

  const addTechnology = () => {
    if (newTech.trim()) {
      const currentTech = getValues("technologies") || [];
      setValue("technologies", [...currentTech, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTechnology = (index: number) => {
    const currentTech = getValues("technologies") || [];
    setValue(
      "technologies",
      currentTech.filter((_, i) => i !== index)
    );
  };

  const addLink = () => {
    if (newLink.type.trim() && newLink.href.trim() && newLink.icon.trim()) {
      const currentLinks = getValues("links") || [];
      setValue("links", [...currentLinks, { ...newLink }]);
      setNewLink({ type: "", href: "", icon: "" });
    }
  };

  const removeLink = (index: number) => {
    const currentLinks = getValues("links") || [];
    setValue(
      "links",
      currentLinks.filter((_, i) => i !== index)
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      uploadProjectImage.mutate(formData);
    }
  };

  return (
    <section className="flex flex-col">
      <AnimatePresence mode="wait">
        {isEdit ? (
          // Edit & create form
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: -15, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, scale: 0.97, filter: "blur(6px)" }}
            transition={{
              duration: 0.1,
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
          >
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-xl font-bold mt-3">
                {getValues("_id") ? t("editProject") : t("createProject")}
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      reset();
                      resetMutation();
                      setIsEdit(false);
                    }}
                    variant={"secondary"}
                    size={"icon"}
                    className="size-8"
                  >
                    <IoMdClose className="text-red-700 text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("cancel")}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onsubmit)}
              className="flex flex-col gap-4 mb-2 mt-5"
            >
              {/* Image Upload Section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("projectImage")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative">
                    <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors">
                      {getValues("image") ? (
                        <Image
                          src={getValues("image")}
                          alt="Project preview"
                          width={120}
                          height={120}
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <div className="text-muted-foreground text-2xl mb-1">
                            📷
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {t("noImage")}
                          </span>
                        </div>
                      )}
                    </div>
                    {getValues("image") && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => deleteUploadedProjectImage.mutate()}
                        disabled={deleteUploadedProjectImage.isPending}
                      >
                        <IoMdClose className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {!getValues("image") && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadProjectImage.isPending}
                          className="w-full sm:w-auto"
                        >
                          {uploadProjectImage.isPending ? (
                            <>
                              <Loading size="sm" className="mr-2" />
                              {t("uploading")}
                            </>
                          ) : (
                            <>📷 {t("uploadImage")}</>
                          )}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("image", file);
                            uploadProjectImage.mutate(formData);
                          }}
                          disabled={uploadProjectImage.isPending}
                        />
                        <p className="text-xs text-muted-foreground">
                          {t("uploadImageHint") || "JPG, PNG up to 10MB"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("projectTitle")}
                  </label>
                  <Input
                    {...register("title")}
                    placeholder={t("projectTitlePlaceholder")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("projectUrl")}
                  </label>
                  <Input
                    {...register("href")}
                    placeholder={t("projectUrlPlaceholder")}
                    className={errors.href ? "border-red-500" : ""}
                  />
                  {errors.href && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.href.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("projectDates")}
                  </label>
                  <Input
                    {...register("dates")}
                    placeholder={t("projectDatesPlaceholder")}
                    className={errors.dates ? "border-red-500" : ""}
                  />
                  {errors.dates && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dates.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("projectDescription")}
                </label>
                <Textarea
                  {...register("description")}
                  placeholder={t("projectDescriptionPlaceholder")}
                  className={errors.description ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("technologies")}
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder={t("technologyPlaceholder")}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTechnology())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addTechnology}
                    size="sm"
                    className="shrink-0"
                  >
                    <GoPlus className="h-4 w-4 mr-1" />
                    {t("add")}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(getValues("technologies") || []).map((tech, index) => (
                    <Badge key={index} onDelete={() => removeTechnology(index)}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links Management */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("projectLinks")}
                </label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 min-w-0">
                      <select
                        value={newLink.type}
                        onChange={(e) => {
                          const selectedIcon = availableIcons.find(
                            (icon) => icon.value === e.target.value
                          );
                          setNewLink({
                            ...newLink,
                            type: e.target.value,
                            icon: selectedIcon?.value || "",
                          });
                        }}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">{t("selectLinkType")}</option>
                        {availableIcons.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.emoji} {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        value={newLink.href}
                        onChange={(e) =>
                          setNewLink({ ...newLink, href: e.target.value })
                        }
                        placeholder={t("linkUrlPlaceholder")}
                        type="url"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addLink}
                      size="sm"
                      disabled={!newLink.type || !newLink.href}
                      className="shrink-0 w-full sm:w-auto"
                    >
                      <GoPlus className="h-4 w-4 mr-1" />
                      {t("add")}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(getValues("links") || []).map((link, index) => {
                    const iconInfo = availableIcons.find(
                      (icon) => icon.value === link.icon
                    );
                    return (
                      <Badge
                        key={index}
                        onDelete={() => removeLink(index)}
                        className="flex items-center gap-1"
                      >
                        <span className="text-xs">{iconInfo?.emoji}</span>
                        {link.type}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("active")} id="active" />
                <label htmlFor="active" className="text-sm font-medium">
                  {t("active")}
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={btnLoading}>
                  {btnLoading ? (
                    <Loading size="sm" />
                  ) : getValues("_id") ? (
                    t("update")
                  ) : (
                    t("create")
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    resetMutation();
                    setIsEdit(false);
                  }}
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          // Projects list
          <motion.div
            key="projects-list"
            initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(6px)" }}
            transition={{
              duration: 0.1,
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
          >
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-xl font-bold mt-3">{t("title")}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsEdit(true)}
                    variant={"secondary"}
                    size={"icon"}
                    className="size-8"
                  >
                    <GoPlus className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("addProject")}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-4 mt-5">
              {projects?.map((project: any, index: number) => (
                <BlurFade
                  key={project._id}
                  delay={BLUR_FADE_DELAY * 2 + index * 0.05}
                >
                  <ProjectCard
                    project={project}
                    onEdit={editProject}
                    onDelete={deleteProject}
                    isDeleting={isDeletingProject}
                  />
                </BlurFade>
              ))}
            </div>

            {(!projects || projects.length === 0) && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("noProjects")}</p>
                <Button
                  onClick={() => setIsEdit(true)}
                  variant="outline"
                  className="mt-2"
                >
                  {t("createFirstProject")}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
