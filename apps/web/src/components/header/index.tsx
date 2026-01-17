import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { ThemeDropdown } from "./dropdown";

export function Header() {
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
              <span>Courses</span>
            </Button>
          </Link>

          <Link to="/schedule">
            <Button size="lg" variant="ghost">
              <Calendar className="size-4" />
              <span>Schedule</span>
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
