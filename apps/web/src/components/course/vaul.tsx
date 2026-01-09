import type { CSSProperties, ReactNode } from "react";
import { Drawer } from "vaul-base";

interface CourseVaulType {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

function CourseVaul({ children, style, className }: CourseVaulType) {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger
        render={(props) => {
          return (
            <div {...props} className={className} style={style}>
              {children}
            </div>
          );
        }}
      />
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Drawer.Content className="fixed top-0 right-0 z-50 flex h-full w-[90vw] flex-row rounded-l-lg border bg-background p-6 text-foreground sm:w-[70vw] lg:w-[50vw]">
          <div className="mx-auto flex h-full max-w-sm flex-col justify-center space-y-4 px-4">
            <p>test vaul</p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
export default CourseVaul;
