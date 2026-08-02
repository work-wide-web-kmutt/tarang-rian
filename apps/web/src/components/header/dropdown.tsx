import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar, Menu, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function isTheme(value: unknown): value is "system" | "light" | "dark" {
  return value === "system" || value === "light" || value === "dark";
}

export function ThemeDropdown() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // oxlint-disable-next-line react/react-compiler -- mount state prevents hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme ?? "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          aria-label={t("nav.menu")}
          className="size-8 rounded-full p-0"
          size="icon"
          type="button"
          variant="ghost"
        >
          <Menu className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="flex w-full cursor-pointer gap-2.5" to="/courses">
              <BookOpen className="size-4" />
              <span>{t("nav.courses")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="flex w-full cursor-pointer gap-2.5" to="/schedule">
              <Calendar className="size-4" />
              <span>{t("nav.schedule")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("theme.label")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value) => {
              if (isTheme(value)) {
                setTheme(value);
              }
            }}
            value={currentTheme}
          >
            {themes.map(({ key, icon: Icon, translationKey }) => (
              <DropdownMenuRadioItem key={key} value={key}>
                <Icon className="size-4" />
                <span>{t(translationKey)}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
