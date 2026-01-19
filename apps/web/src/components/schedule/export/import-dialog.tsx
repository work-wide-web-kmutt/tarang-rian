import { FileUp, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type SelectedClassSession,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

type ImportMode = "replace" | "merge";

export function ScheduleImportDialog() {
  const { t } = useTranslation();
  const { importSchedule } = useSelectedGenElectivesActions();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ImportMode>("replace");
  const [sessions, setSessions] = useState<SelectedClassSession[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error("Invalid format");
        }
        setSessions(json as SelectedClassSession[]);
      } catch {
        setError(t("import.invalid_format", "Invalid JSON format"));
        setSessions([]);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (sessions.length === 0) {
      return;
    }

    try {
      importSchedule(sessions, mode);
      toast.success(t("import.success", "Schedule imported successfully!"));
      setIsOpen(false);
      resetState();
    } catch {
      toast.error(t("import.error", "Failed to import schedule"));
    }
  };

  const resetState = () => {
    setSessions([]);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetState();
        }
      }}
      open={isOpen}
    >
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-2"
        )}
      >
        <Upload className="size-4" />
        {t("import.button", "Import")}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("import.title", "Import Schedule")}</DialogTitle>
          <DialogDescription>
            {t("import.description", "Import a schedule from a JSON file.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("import.file", "File")}</Label>
            <button
              className={cn(
                "flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted-foreground/25 border-dashed bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50",
                error && "border-destructive/50"
              )}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <FileUp className="h-8 w-8 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">
                {fileName || t("import.dropzone", "Click to select JSON file")}
              </span>
            </button>
            <input
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          {sessions.length > 0 && (
            <>
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="font-medium text-sm">
                  {t("import.sessions_count", "{{count}} sessions found", {
                    count: sessions.length,
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t("import.mode", "Import Mode")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="w-full"
                    onClick={() => setMode("replace")}
                    size="sm"
                    variant={mode === "replace" ? "default" : "outline"}
                  >
                    {t("import.replace", "Replace")}
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => setMode("merge")}
                    size="sm"
                    variant={mode === "merge" ? "default" : "outline"}
                  >
                    {t("import.merge", "Merge")}
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  {mode === "replace"
                    ? t(
                        "import.replace_hint",
                        "Replace current schedule with imported data"
                      )
                    : t(
                        "import.merge_hint",
                        "Add imported sessions to current schedule"
                      )}
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline">{t("form.cancel", "Cancel")}</Button>
            }
          />
          <Button disabled={sessions.length === 0} onClick={handleImport}>
            {t("import.confirm", "Import")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
