"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  danger?: boolean;
  dir?: "rtl" | "ltr";
  locale?: string;
  itemName?: string;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  confirmText,
  cancelText,
  danger = true,
  dir = "ltr",
  locale,
  itemName,
  onConfirm,
}: ConfirmDialogProps) {
  const t = useTranslations("dashboard");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={dir}
        className={`w-[95%] sm:w-full sm:max-w-[420px] left-[2.5%] translate-x-0 sm:left-1/2 sm:-translate-x-1/2 ${
          locale === "en" ? "font-robotRegular" : "font-estedadRegular"
        }`}
      >
        <DialogHeader
          className={`${locale === "fa" ? "text-right" : "text-left"}`}
        >
          <DialogTitle
            className={`flex items-center gap-2 ${
              locale === "fa" ? "float-right" : "float-left"
            }`}
          >
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span>
              {title ?? t("confirmTitle", { defaultValue: "Are you sure?" })}
            </span>
          </DialogTitle>
        </DialogHeader>
        {itemName && (
          <div
            className={`space-y-2 ${
              locale === "fa" ? "text-right" : "text-left"
            }`}
          >
            <p className="text-sm">
              <span className="font-semibold break-words">{itemName}</span>
            </p>
          </div>
        )}
        <DialogFooter
          className={`flex gap-2 ${
            locale === "fa" ? "flex-row-reverse" : "flex-row justify-end"
          }`}
        >
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText ?? t("cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            variant={danger ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {confirmText ?? t("delete", { defaultValue: "Delete" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
