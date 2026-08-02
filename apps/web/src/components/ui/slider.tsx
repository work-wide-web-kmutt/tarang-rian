import { Slider as BaseSlider } from "@base-ui/react/slider";
import type * as React from "react";
import { cn } from "@/lib/utils";

type BaseSliderProps = React.ComponentProps<typeof BaseSlider.Root>;

interface RangeSliderProps
  extends Omit<
    BaseSliderProps,
    "children" | "defaultValue" | "onValueChange" | "value"
  > {
  value: readonly [number, number];
  onValueChange?: (value: readonly number[]) => void;
  getAriaLabel?: (index: number) => string;
  getAriaValueText?: (
    formattedValue: string,
    value: number,
    index: number
  ) => string;
}

export function RangeSlider({
  className,
  getAriaLabel,
  getAriaValueText,
  onValueChange,
  value,
  ...props
}: RangeSliderProps) {
  return (
    <BaseSlider.Root
      {...props}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      onValueChange={onValueChange}
      value={value}
    >
      <BaseSlider.Control className="relative flex h-5 w-full items-center">
        <BaseSlider.Track className="relative h-1.5 w-full grow overflow-visible rounded-full bg-muted">
          <BaseSlider.Indicator className="absolute h-full rounded-full bg-primary" />
          <BaseSlider.Thumb
            className="block size-4 rounded-full border border-primary bg-background shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
            index={0}
          />
          <BaseSlider.Thumb
            className="block size-4 rounded-full border border-primary bg-background shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
            index={1}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
