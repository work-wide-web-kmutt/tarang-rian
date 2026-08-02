import { Link } from "@tanstack/react-router";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const logoVariants = cva("", {
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

export interface LogoProps
  extends
    React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof logoVariants> {
  alt?: string;
}

export function Logo({ alt, className, size, ...props }: LogoProps) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // oxlint-disable-next-line react/react-compiler -- mount state prevents hydration mismatch
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/static/logos/logo-full-dark.svg"
      : "/static/logos/logo-full-light.svg";
  const imageAlt = alt ?? t("brand.logo_alt");

  return (
    <Link aria-label={t("nav.home")} to="/">
      <img
        alt={imageAlt}
        className={cn(logoVariants({ className, size }))}
        src={logoSrc}
        {...props}
      />
    </Link>
  );
}
