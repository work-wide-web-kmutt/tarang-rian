import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const logoVariants = cva("", {
  variants: {
    size: {
      xs: "w-16",
      sm: "w-24",
      base: "w-32",
      lg: "w-40",
      xl: "w-48",
      "2xl": "w-56",
      "3xl": "w-64",
      "4xl": "w-72",
      "5xl": "w-80",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

export interface LogoProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof logoVariants> {
  alt?: string;
}

export function Logo({
  alt = "Tarang Rian KMUTT logo",
  className,
  size,
  ...props
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/static/logos/logo-full-dark.svg"
      : "/static/logos/logo-full-light.svg";

  return (
    <Link aria-label="Go to home page" to="/">
      {/* biome-ignore lint/correctness/useImageSize: width/height can be provided via props for flexible sizing */}
      <img
        alt={alt}
        className={cn(logoVariants({ size, className }))}
        src={logoSrc}
        {...props}
      />
    </Link>
  );
}
