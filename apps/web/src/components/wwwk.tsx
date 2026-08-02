import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { useTranslation } from "react-i18next";

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

export function Wwwk({ alt, className, size, ...props }: WwwkProps) {
  const { t } = useTranslation();
  const imageAlt = alt ?? t("brand.wwwk_logo_alt");

  return (
    <img
      alt={imageAlt}
      className={cn(wwwkVariants({ className, size }))}
      src="/static/logos/wwwk-logo.svg"
      {...props}
    />
  );
}
