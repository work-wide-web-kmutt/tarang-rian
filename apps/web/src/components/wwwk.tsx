import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const wwwkVariants = cva("", {
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

export interface WwwkProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
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
    <>
      {/* biome-ignore lint/correctness/useImageSize: width/height can be provided via props for flexible sizing */}
      <img
        alt={alt}
        className={cn(wwwkVariants({ size, className }))}
        src="/static/logos/wwwk-logo.svg"
        {...props}
      />
    </>
  );
}
