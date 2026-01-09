import { type CSSProperties, type ReactNode, useState } from "react";
import { Drawer } from "vaul-base";
import { cn } from "@/lib/utils";

interface CourseVaulType {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  isHighlighted?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function CourseVaul({
  children,
  style,
  className,
  isHighlighted = false,
  onOpenChange,
}: CourseVaulType) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Drawer.Root direction="right" onOpenChange={handleOpenChange} open={open}>
      <Drawer.Trigger
        render={(props) => {
          return (
            <div
              {...props}
              className={cn(
                className,
                "transition-all duration-300 ease-in-out",
                isHighlighted && "z-60"
              )}
              style={style}
            >
              {children}
            </div>
          );
        }}
      />
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Drawer.Content className="fixed top-0 right-0 z-70 flex h-full w-[80vw] flex-row rounded-l-lg border bg-background p-6 text-foreground sm:w-[40vw] lg:w-[30vw]">
          <div className="mx-auto flex h-full max-w-sm flex-col justify-center space-y-4 px-4">
            <p>test vaul</p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
export default CourseVaul;
