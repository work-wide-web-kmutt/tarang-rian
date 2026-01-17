import { useTranslation } from "react-i18next";
import { CourseVaulContent } from "@/components/course/vaul/content";
import { useCourseVaulContext } from "@/components/course/vaul/context";
import { CourseVaulForm } from "@/components/course/vaul/form";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function CourseVaulSheet() {
  const { open, setOpen, isEditing, children, style, className, session } =
    useCourseVaulContext();
  const { t } = useTranslation();

  return (
    <>
      <div
        className={cn(className, "transition-all duration-300 ease-out")}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        role="button"
        style={style}
        tabIndex={0}
      >
        {children}
      </div>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetContent
          className="flex h-full w-[80vw] flex-col rounded-l-lg border-l p-6 text-foreground sm:w-[60vw] lg:w-[40vw] xl:w-[20vw]"
          showCloseButton={false}
          side="right"
        >
          {session ? (
            <div className="flex h-full flex-col space-y-6 overflow-y-auto">
              {isEditing ? <CourseVaulForm /> : <CourseVaulContent />}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                {t("courses.no_course_info")}
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
