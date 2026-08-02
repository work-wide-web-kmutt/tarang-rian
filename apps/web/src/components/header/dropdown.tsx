import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar, Menu, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

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
    label: "System theme",
  },
  {
    icon: Sun,
    key: "light",
    label: "Light theme",
  },
  {
    icon: Moon,
    key: "dark",
    label: "Dark theme",
  },
];

function isTheme(value: unknown): value is "system" | "light" | "dark" {
  return value === "system" || value === "light" || value === "dark";
}

export function ThemeDropdown() {
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
          aria-label="Menu"
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
              <span>Courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="flex w-full cursor-pointer gap-2.5" to="/schedule">
              <Calendar className="size-4" />
              <span>Schedule</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value) => {
              if (isTheme(value)) {
                setTheme(value);
              }
            }}
            value={currentTheme}
          >
            {themes.map(({ key, icon: Icon, label }) => (
              <DropdownMenuRadioItem key={key} value={key}>
                <Icon className="size-4" />
                <span>{label}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
