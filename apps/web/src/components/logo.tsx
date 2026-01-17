import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  className?: string;
}

export function Logo({
  alt = "Tarang Rian KMUTT logo",
  className,
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

  // biome-ignore lint/correctness/useImageSize: width/height can be provided via props for flexible sizing
  return <img alt={alt} className={cn(className)} src={logoSrc} {...props} />;
}
