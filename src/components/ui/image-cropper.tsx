"use client";
import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

type ImageCropperProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  src: string | null;
  aspect?: number; // width/height, default 1 (square)
  dir?: "rtl" | "ltr";
  isDark?: boolean; // for slider accent color
  labels: {
    title: string;
    apply: string;
    cancel: string;
    zoom: string;
    move: string;
  };
  outputSize?: number; // final pixel size for width (height derived by aspect)
  onCropped: (file: File) => void;
};

type CropperBodyProps = {
  src: string | null;
  aspect: number;
  dir: "rtl" | "ltr";
  isDark: boolean;
  labels: ImageCropperProps["labels"];
  outputSize: number;
  onCropped: (file: File) => void;
  onClose: () => void;
};

function CropperBody({
  src,
  aspect,
  dir,
  isDark,
  labels,
  outputSize,
  onCropped,
  onClose,
}: CropperBodyProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped);
  }, []);

  const applyCrop = useCallback(async () => {
    if (!src || !croppedAreaPixels) return;
    const image = new Image();
    const blob = await new Promise<Blob | null>((resolve) => {
      image.onload = () => {
        const outW = outputSize;
        const outH = Math.round(outputSize / aspect);
        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        const { x, y, width, height } = croppedAreaPixels;
        ctx.drawImage(image, x, y, width, height, 0, 0, outW, outH);
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92);
      };
      image.src = src;
    });
    if (!blob) return;
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    onCropped(file);
    onClose();
  }, [src, croppedAreaPixels, outputSize, aspect, onCropped, onClose]);

  return (
    <>
      <DialogHeader className={`${dir === "rtl" ? "text-right" : "text-left"}`}>
        <DialogTitle>{labels.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3" dir={dir}>
        <div className="relative w-full h-[280px] bg-muted rounded-md overflow-hidden">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit="contain"
              showGrid={false}
              cropShape="rect"
              classes={{ containerClassName: "!bg-background" }}
            />
          )}
        </div>
        <div
          className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
        >
          <label className="text-sm text-muted-foreground whitespace-nowrap">
            {labels.zoom}
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
            style={{ accentColor: isDark ? "#ffffff" : "#000000" }}
          />
        </div>
        <p
          className={`text-xs text-muted-foreground ${
            dir === "rtl" ? "text-right" : "text-left"
          }`}
        >
          {labels.move}
        </p>
      </div>
      <DialogFooter
        className={`flex gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
      >
        <Button variant="outline" type="button" onClick={onClose}>
          {labels.cancel}
        </Button>
        <Button type="button" onClick={applyCrop}>
          {labels.apply}
        </Button>
      </DialogFooter>
    </>
  );
}

export default function ImageCropperDialog({
  open,
  onOpenChange,
  src,
  aspect = 1,
  dir = "ltr",
  isDark = false,
  labels,
  outputSize = 512,
  onCropped,
}: ImageCropperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:w-full sm:max-w-[420px] left-[2.5%] translate-x-0 sm:left-1/2 sm:-translate-x-1/2">
        {open ? (
          <CropperBody
            key={src ?? "no-src"}
            src={src}
            aspect={aspect}
            dir={dir}
            isDark={isDark}
            labels={labels}
            outputSize={outputSize}
            onCropped={onCropped}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
