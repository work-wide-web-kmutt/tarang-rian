import { FileUp, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";

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
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AcademicTerm } from "@/course/academic-term";
import { cn } from "@/lib/utils";
import {
  normalizeSelectedSession,
  useSelectedGenElectivesActions,
} from "@/stores/selected";
import type { SelectedClassSession } from "@/stores/selected";

type ImportMode = "replace" | "merge";

interface ScheduleImportDialogProps {
  term: AcademicTerm;
  triggerClassName?: string;
}

const importSchema = z.array(z.unknown());

function parseImportedSessions(
  value: unknown,
  term: AcademicTerm
): SelectedClassSession[] {
  const parsed = importSchema.parse(value);
  const normalized = parsed.map((session) =>
    normalizeSelectedSession(session, term)
  );
  if (normalized.some((session) => session === null)) {
    throw new Error("Invalid format");
  }
  return normalized.filter(
    (session): session is SelectedClassSession => session !== null
  );
}

export function ScheduleImportDialog({
  term,
  triggerClassName,
}: ScheduleImportDialogProps) {
  const { t } = useTranslation();
  const { importSchedule } = useSelectedGenElectivesActions();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ImportMode>("replace");
  const [sessions, setSessions] = useState<SelectedClassSession[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"paste" | "file">("paste");
  const [pastedJson, setPastedJson] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePasteChange(value: string): void {
    setPastedJson(value);
    setError(null);

    if (!value.trim()) {
      setSessions([]);
      return;
    }

    try {
      const json: unknown = JSON.parse(value);
      setSessions(parseImportedSessions(json, term));
    } catch {
      setError(t("import.invalid_format", "Invalid JSON format"));
      setSessions([]);
    }
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setError(null);

    try {
      const json: unknown = JSON.parse(await file.text());
      setSessions(parseImportedSessions(json, term));
    } catch {
      setError(t("import.invalid_format", "Invalid JSON format"));
      setSessions([]);
    }
  }

  function handleImport(): void {
    if (sessions.length === 0) {
      return;
    }

    try {
      importSchedule(term, sessions, mode);
      toast.success(t("import.success", "Schedule imported successfully!"));
      setIsOpen(false);
      resetState();
    } catch {
      toast.error(t("import.error", "Failed to import schedule"));
    }
  }

  function resetState(): void {
    setSessions([]);
    setFileName(null);
    setError(null);
    setPastedJson("");
    setActiveTab("paste");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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
        aria-label={t("import.button", "Import")}
        className={cn(
          buttonVariants({ size: "sm", variant: "outline" }),
          triggerClassName
        )}
      >
        <Upload className="size-5 sm:size-4" />
        <span className="hidden sm:inline">{t("import.button", "Import")}</span>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("import.title", "Import Schedule")}</DialogTitle>
          <DialogDescription>
            {t("import.description", "Import a schedule from a JSON file.")}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="paste"
          onValueChange={(value) => {
            setActiveTab(value === "file" ? "file" : "paste");
            setError(null);
          }}
          value={activeTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTab value="paste">{t("import.tabPaste", "Paste")}</TabsTab>
            <TabsTab value="file">{t("import.tabFile", "File")}</TabsTab>
          </TabsList>

          <div className="mt-4 space-y-4">
            <TabsPanel className="space-y-2" value="paste">
              <Label>{t("import.tabPaste", "Paste")}</Label>
              <Textarea
                className="max-h-64 min-h-32 overflow-y-auto font-mono text-sm"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  handlePasteChange(e.target.value);
                }}
                placeholder={t("import.pastePlaceholder", "Paste JSON here...")}
                value={pastedJson}
              />
              {error !== null && error !== "" && (
                <p className="text-destructive text-sm">{error}</p>
              )}
            </TabsPanel>

            <TabsPanel className="space-y-2" value="file">
              <Label>{t("import.file", "File")}</Label>
              <button
                className={cn(
                  "flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted-foreground/25 border-dashed bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50",
                  error !== null && error !== "" && "border-destructive/50"
                )}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <FileUp className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {fileName !== null && fileName !== ""
                    ? fileName
                    : t("import.dropzone", "Click to select JSON file")}
                </span>
              </button>
              <input
                accept=".json,application/json"
                className="hidden"
                onChange={(event) => {
                  void handleFileChange(event);
                }}
                ref={fileInputRef}
                type="file"
              />
              {error !== null && error !== "" && (
                <p className="text-destructive text-sm">{error}</p>
              )}
            </TabsPanel>

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
                      onClick={() => {
                        setMode("replace");
                      }}
                      size="sm"
                      variant={mode === "replace" ? "default" : "outline"}
                    >
                      {t("import.replace", "Replace")}
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setMode("merge");
                      }}
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
        </Tabs>

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
