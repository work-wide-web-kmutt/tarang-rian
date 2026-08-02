import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const themes = [
  {
    icon: Monitor,
    key: "system",
    translationKey: "theme.system",
  },
  {
    icon: Sun,
    key: "light",
    translationKey: "theme.light",
  },
  {
    icon: Moon,
    key: "dark",
    translationKey: "theme.dark",
  },
];

export interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    // oxlint-disable-next-line react/react-compiler -- mount state prevents hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme ?? "system";

  return (
    <div
      className={cn(
        "relative isolate flex h-8 w-fit rounded-full bg-background p-1 ring-1 ring-border",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, translationKey }) => {
        const isActive = currentTheme === key;

        return (
          <button
            aria-label={t(translationKey)}
            className="relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => {
              setTheme(key);
            }}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId="activeTheme"
                transition={{ duration: 0.5, type: "spring" }}
              />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto h-4 w-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
