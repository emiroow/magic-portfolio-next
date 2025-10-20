"use client";
import useSocials from "@/hooks/dashboard/useSocials";
import { useLocale, useTranslations } from "next-intl";
import { cloneElement, isValidElement, useState } from "react";
import { iconDecider } from "../icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { Input } from "../ui/input";
import Loading from "../ui/loading";

const availableIcons = [
  "linkedin",
  "github",
  "instagram",
  "telegram",
  "youtube",
  "whatsapp",
  "x",
  "website",
];

const Socials = () => {
  const t = useTranslations("dashboard.social");
  const tDash = useTranslations("dashboard");
  const locale = useLocale();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    socials,
    isLoading,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isDirty },
    onsubmit,
    isEdit,
    setIsEdit,
    deleteSocial,
    deleting,
    creating,
    updating,
  } = useSocials();
  const selectedIcon = watch("icon");

  return (
    <section>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold mt-3">{t("title")}</h3>
      </div>

      {/* Create/Edit Form */}
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-5"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            {t("name")}
          </label>
          <Input
            {...register("name")}
            placeholder={t("namePlaceholder")}
            autoComplete="off"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            {t("url")}
          </label>
          <Input
            {...register("url")}
            placeholder={t("urlPlaceholder")}
            type="url"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {locale === "fa" ? (
              <>
                {t("icon")}
                {selectedIcon ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-muted text-foreground">
                    {(() => {
                      const node = iconDecider(selectedIcon);
                      return isValidElement(node)
                        ? cloneElement(node as any, { className: "w-4 h-4" })
                        : node;
                    })()}
                  </span>
                ) : null}
              </>
            ) : (
              <>
                {selectedIcon ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-muted text-foreground">
                    {(() => {
                      const node = iconDecider(selectedIcon);
                      return isValidElement(node)
                        ? cloneElement(node as any, { className: "w-4 h-4" })
                        : node;
                    })()}
                  </span>
                ) : null}
                {t("icon")}
              </>
            )}
          </label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register("icon")}
          >
            <option value="">{t("selectIcon")}</option>
            {availableIcons.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="submit"
            disabled={creating || updating || (socials?.length || 0) >= 4}
            className="w-full"
          >
            {creating || updating ? <Loading size="sm" /> : t("save")}
          </Button>
          {isEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsEdit(false);
              }}
            >
              {tDash("cancel")}
            </Button>
          )}
        </div>
      </form>

      {/* List */}
      {isLoading ? (
        <Loading className="h-64" />
      ) : (
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex flex-wrap gap-2">
            {socials?.map((s) => (
              <Badge
                key={s._id}
                onDelete={() => {
                  setSelectedId(s._id!);
                  setConfirmOpen(true);
                }}
                className="flex items-center gap-1"
                onClick={() => {
                  setIsEdit(true);
                  setValue("_id", s._id);
                  setValue("name", s.name);
                  setValue("url", s.url);
                  setValue("icon", s.icon);
                }}
              >
                <span className="text-base">{iconDecider(s.icon)}</span>
                {s.name}
              </Badge>
            ))}
          </div>

          {(!socials || socials.length === 0) && (
            <div className="text-center py-8 mt-10">
              <p className="text-muted-foreground mb-3">{t("noSocials")}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEdit(false);
                  // Focus name input for quick add
                  const el =
                    document.querySelector<HTMLInputElement>(
                      "input[name='name']"
                    );
                  el?.focus();
                }}
              >
                {t("addFirstSocial")}
              </Button>
            </div>
          )}
          {socials && socials.length >= 4 && (
            <p className="text-xs text-muted-foreground">{t("maxReached")}</p>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={tDash("confirmTitle")}
        confirmText={tDash("delete")}
        cancelText={tDash("cancel")}
        danger
        dir={locale === "fa" ? "rtl" : "ltr"}
        locale={locale}
        itemName={socials?.find((x) => x._id === selectedId)?.name}
        onConfirm={() => {
          if (selectedId) deleteSocial(selectedId);
          setConfirmOpen(false);
          setSelectedId(null);
        }}
      />
    </section>
  );
};

export default Socials;
