import {
  CalendarMinus2,
  CalendarPlus2,
  Copy,
  Download,
  Grid,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { SchedulePreview } from "@/components/schedule/export/schedule-preview";
import {
  downloadFile,
  exportAsImage,
  exportAsPdf,
} from "@/components/schedule/export/utils";
import type { ExportFormat } from "@/components/schedule/export/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { AcademicTerm } from "@/course/academic-term";
import { cn } from "@/lib/utils";
import { useScheduleTimeRange } from "@/stores/schedule-settings";
import type { SelectedClassSession } from "@/stores/selected";

interface ScheduleExportDialogProps {
  sessions: SelectedClassSession[];
  term: AcademicTerm;
  triggerClassName?: string;
}

export function ScheduleExportDialog({
  sessions,
  term,
  triggerClassName,
}: ScheduleExportDialogProps) {
  const { t } = useTranslation();
  const timeRange = useScheduleTimeRange();

  const [format, setFormat] = useState<ExportFormat>("png");
  const [darkMode, setDarkMode] = useState(false);
  const [showBackground, setShowBackground] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [padding, setPadding] = useState("16");
  const [scale, setScale] = useState("2");
  const [isExporting, setIsExporting] = useState(false);
  const [isShorthand, setIsShorthand] = useState(true);

  // Background Color Presets
  const BG_PRESETS = [
    { name: "White", value: "#ffffff" },
    { name: "Slate", value: "#e2e8f0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Yellow", value: "#fef08a" },
    { name: "Orange", value: "#fed7aa" },
    { name: "Red", value: "#fecaca" },
    { name: "Rose", value: "#fecdd3" },
    { name: "Black", value: "#000000" },
  ];

  async function handleExport(): Promise<void> {
    setIsExporting(true);

    try {
      if (format === "json") {
        const jsonData = JSON.stringify(sessions, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        downloadFile(url, `schedule-${term.year}-${term.semester}.json`);
        URL.revokeObjectURL(url);
      } else {
        // Allow time for the Portal to render the export target
        // oxlint-disable-next-line promise/avoid-new -- allow portal render before capture
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 100);
        });

        if (format === "pdf") {
          const pdf = await exportAsPdf("schedule-export-target");
          pdf.save(`schedule-${term.year}-${term.semester}.pdf`);
        } else {
          const dataUrl = await exportAsImage(
            "schedule-export-target",
            format,
            Math.trunc(Number(scale))
          );
          if (dataUrl) {
            downloadFile(
              dataUrl,
              `schedule-${term.year}-${term.semester}.${format}`
            );
          }
        }
      }
      toast.success(t("export.success", "Schedule exported successfully!"));
    } catch (error) {
      console.error(error);
      toast.error(t("export.error", "Failed to export schedule"));
    } finally {
      setIsExporting(false);
    }
  }

  async function handleCopyToClipboard(): Promise<void> {
    try {
      const jsonData = JSON.stringify(sessions, null, 2);
      await navigator.clipboard.writeText(jsonData);
      toast.success(t("export.copySuccess", "JSON copied to clipboard"));
    } catch (error) {
      console.error(error);
      toast.error(t("export.copyError", "Failed to copy JSON to clipboard"));
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        aria-label={t("export.button", "Export")}
        className={cn(
          buttonVariants({ size: "sm", variant: "outline" }),
          triggerClassName
        )}
        disabled={sessions.length === 0}
      >
        <Download className="size-5 sm:size-4" />
        <span className="hidden sm:inline">{t("export.button", "Export")}</span>
      </DialogTrigger>

      <DialogContent className="flex max-h-[95vh] w-full max-w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:rounded-lg lg:max-w-300">
        <DialogHeader className="shrink-0 border-b p-6 pb-2">
          <DialogTitle>{t("export.title", "Export Schedule")}</DialogTitle>
          <DialogDescription>
            {t("export.description", "Customize and download your schedule.")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="relative flex-1 overflow-auto bg-muted/30 p-4">
            {format === "json" ? (
              <div className="relative flex h-full flex-col">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    aria-label={t("export.copyAriaLabel", "Copy JSON")}
                    onClick={() => {
                      void handleCopyToClipboard();
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {t("export.copy", "Copy")}
                  </Button>
                </div>
                <pre className="h-full overflow-auto rounded-md border bg-background p-4 font-mono text-sm">
                  {JSON.stringify(sessions, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex min-h-full w-fit min-w-full items-start justify-center p-8">
                <div
                  className={cn(
                    "min-w-fit origin-top scale-[0.45] shadow-lg transition-all sm:scale-[0.6] lg:scale-[0.75]",
                    !showBackground &&
                      "bg-[repeating-conic-gradient(#e2e8f0_0%_25%,transparent_0%_50%)] bg-size-[20px_20px] bg-white"
                  )}
                >
                  <div
                    // Remove padding from key to enable transition
                    className="w-fit transition-all duration-300 ease-in-out"
                    key={`${bgColor}-${showBackground}-${darkMode}-${sessions.length}`}
                    style={{
                      backgroundColor: showBackground ? bgColor : "transparent",
                      display: "inline-block",
                      padding: `${padding}px`,
                    }}
                  >
                    <SchedulePreview
                      darkMode={darkMode}
                      sessions={sessions}
                      shorthand={isShorthand}
                      term={term}
                      timeRange={timeRange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full shrink-0 flex-col border-t bg-background lg:w-[320px] lg:border-t-0 lg:border-l">
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="space-y-3">
                <Label>{t("export.format", "Format")}</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setFormat("png");
                    }}
                    size="sm"
                    variant={format === "png" ? "default" : "outline"}
                  >
                    PNG
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setFormat("jpg");
                    }}
                    size="sm"
                    variant={format === "jpg" ? "default" : "outline"}
                  >
                    JPG
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setFormat("pdf");
                    }}
                    size="sm"
                    variant={format === "pdf" ? "default" : "outline"}
                  >
                    PDF
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setFormat("json");
                    }}
                    size="sm"
                    variant={format === "json" ? "default" : "outline"}
                  >
                    JSON
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>{t("export.appearance", "Appearance")}</Label>
                <div className="flex flex-col gap-2">
                  <Button
                    className="justify-between"
                    onClick={() => {
                      setIsShorthand(!isShorthand);
                    }}
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      {isShorthand ? (
                        <CalendarMinus2 className="h-4 w-4" />
                      ) : (
                        <CalendarPlus2 className="h-4 w-4" />
                      )}
                      {t("export.shorthand", "Short day name")}
                    </span>
                    <span
                      className={
                        isShorthand
                          ? "font-bold text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {isShorthand ? "On" : "Off"}
                    </span>
                  </Button>
                  <Button
                    className="justify-between"
                    onClick={() => {
                      setDarkMode(!darkMode);
                    }}
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      {darkMode ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                      {t("export.darkMode", "Dark Mode")}
                    </span>
                    <span
                      className={
                        darkMode
                          ? "font-bold text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {darkMode ? "On" : "Off"}
                    </span>
                  </Button>
                  <Button
                    className="justify-between"
                    onClick={() => {
                      setShowBackground(!showBackground);
                    }}
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <Grid className="h-4 w-4" />
                      {t("export.background", "Background")}
                    </span>
                    <span
                      className={
                        showBackground
                          ? "font-bold text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {showBackground ? "Show" : "Hide"}
                    </span>
                  </Button>

                  {showBackground && (
                    <div className="flex flex-col gap-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground text-xs">
                          Color
                        </span>
                        <div className="group relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 ring-primary hover:ring-2">
                          <Palette className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground" />
                          <input
                            className="absolute inset-0 -top-1/4 -left-1/4 h-[150%] w-[150%] cursor-pointer border-0 p-0 opacity-0"
                            onChange={(e) => {
                              setBgColor(e.target.value);
                            }}
                            title="Custom Color"
                            type="color"
                            value={bgColor}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {BG_PRESETS.map((preset) => (
                          <button
                            aria-label={preset.name}
                            className={cn(
                              "h-6 w-6 rounded-full border transition-all hover:scale-110",
                              bgColor === preset.value &&
                                "ring-2 ring-primary ring-offset-1"
                            )}
                            key={preset.value}
                            onClick={() => {
                              setBgColor(preset.value);
                            }}
                            style={{ backgroundColor: preset.value }}
                            title={preset.name}
                            type="button"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>{t("export.settings", "Settings")}</Label>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      {t("export.padding", "Padding")}
                    </span>
                    <Select
                      onValueChange={(val: string | null) => {
                        if (val !== null && val !== "") {
                          setPadding(val);
                        }
                      }}
                      value={padding}
                    >
                      <SelectTrigger className="h-8 w-27.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="32">32px</SelectItem>
                        <SelectItem value="64">64px</SelectItem>
                        <SelectItem value="128">128px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      {t("export.scale", "Quality")}
                    </span>
                    <Select
                      disabled={format === "pdf"}
                      onValueChange={(val: string | null) => {
                        if (val !== null && val !== "") {
                          setScale(val);
                        }
                      }}
                      value={scale}
                    >
                      <SelectTrigger className="h-8 w-27.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x (HD)</SelectItem>
                        <SelectItem value="4">4x (UHD)</SelectItem>
                        <SelectItem value="6">6x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t bg-muted/10 p-6">
              <Button
                className="w-full"
                disabled={isExporting}
                onClick={() => {
                  void handleExport();
                }}
                size="lg"
              >
                {isExporting ? (
                  <div>{t("export.processing")}</div>
                ) : (
                  <div className="flex">
                    <Download className="mr-2 h-4 w-4" />
                    {t("export.download")}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {createPortal(
        <div
          style={{
            left: "200vw",
            overflow: "hidden",
            position: "fixed",
            top: 0,
          }}
        >
          <div
            id="schedule-export-target"
            key={`${padding}-${bgColor}-${showBackground}-${darkMode}-${sessions.length}`}
            style={{
              height: "fit-content",
              width: "fit-content",
            }}
          >
            <div
              style={{
                backgroundColor: showBackground ? bgColor : "transparent",
                height: "100%",
                padding: `${padding}px`,
                width: "100%",
              }}
            >
              <SchedulePreview
                darkMode={darkMode}
                sessions={sessions}
                shorthand={isShorthand}
                term={term}
                timeRange={timeRange}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </Dialog>
  );
}
