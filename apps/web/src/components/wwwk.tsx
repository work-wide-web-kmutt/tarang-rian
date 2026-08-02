import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const wwwkVariants = cva("", {
  defaultVariants: {
    size: "base",
  },
  variants: {
    size: {
      "2xl": "w-56",
      "3xl": "w-64",
      "4xl": "w-72",
      "5xl": "w-80",
      base: "w-32",
      lg: "w-40",
      sm: "w-24",
      xl: "w-48",
      xs: "w-16",
    },
  },
});

export interface WwwkProps
  extends
    React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof wwwkVariants> {
  alt?: string;
}

export function Wwwk({
  alt = "WWWK logo",
  className,
  size,
  ...props
}: WwwkProps) {
  return (
    <img
      alt={alt}
      className={cn(wwwkVariants({ className, size }))}
      src="/static/logos/wwwk-logo.svg"
      {...props}
    />
  );
}
