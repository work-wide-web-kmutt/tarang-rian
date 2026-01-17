import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { ThemeDropdown } from "./dropdown";

export function Header() {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <div className="container mx-auto flex h-fit w-full max-w-8xl items-center justify-between px-16 py-3">
        <Logo size="sm" />
        <div className="block md:hidden">
          <ThemeDropdown />
        </div>
        <div className="hidden items-center justify-center gap-2 md:flex">
          <Link to="/courses">
            <Button size="lg" variant="ghost">
              <BookOpen className="size-4" />
              <span>{t("nav.courses")}</span>
            </Button>
          </Link>

          <Link to="/schedule">
            <Button size="lg" variant="ghost">
              <Calendar className="size-4" />
              <span>{t("nav.schedule")}</span>
            </Button>
          </Link>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
