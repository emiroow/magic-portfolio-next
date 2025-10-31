"use client";
import useBlog from "@/hooks/dashboard/useBlog";
import { formatYearMonthLocal } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import BlurFade from "../magicui/blur-fade";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import MarkdownEditor from "../ui/markdown-editor";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Blog = () => {
  const locale = useLocale();
  const t = useTranslations("dashboard.blog");
  const tDash = useTranslations("dashboard");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // simple reading time estimation (~200 wpm)
  const readingTime = (text: string | undefined) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min`;
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    blogs,
    isLoading,
    saveBlog,
    isSaving,
    deleteBlog,
    isDeleting,
    editBlog,
    isEdit,
    setIsEdit,
    getValues,
    isDirty,
    resetSaveMutation,
  } = useBlog();

  // computed filtered/sorted list for nicer UX
  const filteredBlogs = useMemo(() => {
    const list = Array.isArray(blogs) ? [...blogs] : [];
    const sorted = list.sort((a: any, b: any) => {
      const at = new Date(a?.createdAt || 0).getTime();
      const bt = new Date(b?.createdAt || 0).getTime();
      return bt - at;
    });
    if (!query) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (b: any) =>
        (b.title || "").toLowerCase().includes(q) ||
        (b.slug || "").toLowerCase().includes(q)
    );
  }, [blogs, query]);

  // ensure RHF knows about content field since we removed the textarea
  useEffect(() => {
    register("content");
  }, [register]);

  // bind editor to form value
  const contentValue = watch ? watch("content") : getValues("content");

  if (isLoading) return <Loading className="h-[50vh]" />;

  return (
    <section
      className="flex flex-col mb-20"
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <AnimatePresence mode="wait">
        {isEdit ? (
          <motion.div
            key="blog-edit-form"
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
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex flex-row justify-between items-center">
                <h3 className="text-xl font-bold mt-3">
                  {getValues("_id")
                    ? t("edit")
                    : t("createBlog", { defaultValue: "Create blog post" })}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        reset();
                        resetSaveMutation();
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
                    <p>{tDash("cancel")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* form */}
              <form
                onSubmit={handleSubmit((data) => saveBlog(data as any))}
                className="flex flex-col gap-5 mb-2 mt-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("title")}
                    </label>
                    <Input
                      {...register("title")}
                      placeholder={t("titlePlaceholder")}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Slug
                    </label>
                    <Input
                      {...register("slug")}
                      placeholder={t("slugPlaceholder")}
                      className="w-full"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      e.g. my-first-post
                    </p>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("summaryPlaceholder")}
                    </label>
                    <Input
                      {...register("summary")}
                      placeholder={t("summaryPlaceholder")}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("contentPlaceholder")}
                  </label>
                  <div className="rounded-md border">
                    <MarkdownEditor
                      value={contentValue || ""}
                      onChange={(val) =>
                        setValue("content", val, { shouldDirty: true })
                      }
                      placeholder={t("contentPlaceholder")}
                      className="w-full"
                      height={420}
                    />
                  </div>
                </div>

                <div className="flex gap-2 max-sm:flex-col mt-2 mb-24">
                  <Button
                    disabled={isSaving}
                    type="submit"
                    className="w-full sm:w-auto"
                  >
                    {isSaving ? <Loading size="sm" /> : t("save")}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="blog-list"
            initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(6px)" }}
            transition={{
              duration: 0.25,
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h3 className="text-xl font-bold mt-3">
                {t("title")}{" "}
                {!!blogs?.length && (
                  <span className="text-sm text-muted-foreground font-normal">
                    ({blogs.length})
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    locale === "fa" ? "جستجو عنوان/اسلاگ" : "Search title/slug"
                  }
                  className="h-9 w-48 sm:w-64"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsEdit(true)}
                      variant={"secondary"}
                      size={"icon"}
                      className="size-8"
                    >
                      <GoPlus className="text-xl text-green-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {t("createBlog", { defaultValue: "Create blog post" })}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {filteredBlogs && filteredBlogs.length > 0 ? (
              filteredBlogs.map((b: any, index: number) => (
                <BlurFade key={b._id} delay={0.04 * 8 + index * 0.05}>
                  <div className="w-full border rounded p-4 flex flex-col gap-3 hover:bg-muted/30 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium text-base line-clamp-2 sm:line-clamp-1">
                          {b.title}
                        </div>
                        <div className="hidden sm:flex gap-2">
                          <Link
                            href={`/${locale}/blog/${b.slug}`}
                            target="_blank"
                          >
                            <Button variant="ghost" size="sm" className="h-8">
                              {locale === "fa" ? "پیش‌نمایش" : "Preview"}
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => editBlog(b)}
                          >
                            {t("edit")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              setSelectedId(b._id);
                              setConfirmOpen(true);
                            }}
                            disabled={isDeleting}
                          >
                            {tDash("delete")}
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-2 justify-between max-sm:flex-col max-sm:items-start">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-[11px] break-all font-normal bg-muted/50 px-1 py-0.5 rounded">
                              {b.slug}
                            </code>
                            {b.content && (
                              <span className="inline-flex items-center gap-1 text-[11px] px-1 py-0.5 rounded bg-muted/40">
                                {locale === "fa" ? "زمان مطالعه:" : "Read:"}{" "}
                                {readingTime(b.content)}
                              </span>
                            )}
                          </div>
                          <span>
                            {formatYearMonthLocal(
                              b.createdAt || "",
                              locale as any
                            )}
                          </span>
                        </div>
                      </div>
                      {b.summary && (
                        <div className="text-xs text-muted-foreground line-clamp-3 sm:line-clamp-2 mt-1">
                          {b.summary}
                        </div>
                      )}
                    </div>
                    <div className="flex w-full gap-2 sm:hidden">
                      <Link
                        href={`/${locale}/blog/${b.slug}`}
                        target="_blank"
                        className="flex-1"
                      >
                        <Button variant="ghost" className="w-full">
                          {locale === "fa" ? "پیش‌نمایش" : "Preview"}
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => editBlog(b)}
                        className="flex-1"
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedId(b._id);
                          setConfirmOpen(true);
                        }}
                        disabled={isDeleting}
                        className="flex-1"
                      >
                        {tDash("delete")}
                      </Button>
                    </div>
                  </div>
                </BlurFade>
              ))
            ) : (
              <div className="text-center py-8 mt-24">
                <p className="text-muted-foreground">{t("noBlogs")}</p>
                <Button
                  onClick={() => setIsEdit(true)}
                  variant="outline"
                  className="mt-2"
                >
                  {t("createBlog", { defaultValue: "Create blog post" })}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        confirmText={tDash("delete")}
        itemName={
          selectedId ? blogs?.find((b) => b._id === selectedId)?.title : ""
        }
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        dir={locale === "fa" ? "rtl" : "ltr"}
        locale={locale}
        onConfirm={() => {
          if (selectedId) deleteBlog(selectedId);
          setConfirmOpen(false);
        }}
      />
    </section>
  );
};

export default Blog;
