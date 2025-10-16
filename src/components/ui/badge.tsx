import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { MdOutlineDeleteOutline } from "react-icons/md";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional delete handler. If provided, a delete button will be shown. */
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function Badge({ className, variant, onDelete, ...props }: BadgeProps) {
  return (
    <div
      className={`flex items-center gap-1 ${
        onDelete
          ? "border bg-muted p-[4px] rounded-lg dark:border-white border-black "
          : ""
      }`}
    >
      <div className={cn(badgeVariants({ variant }), className)} {...props}>
        {props.children}
      </div>
      {/* delete */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          aria-label="Delete badge"
          className="ml-1 p-0 m-0 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <MdOutlineDeleteOutline className="text-red-500 hover:text-red-700 p-0 m-0 text-lg transition-colors" />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
