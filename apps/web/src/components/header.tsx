import { Link } from "@tanstack/react-router";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/">
            <h1 className="font-bold text-lg">TARANG RIAN KMUTT</h1>
          </Link>
          <nav className="hidden items-center gap-2 sm:flex">
            <Link to="/courses">
              <Button size="sm" variant="ghost">
                All courses
              </Button>
            </Link>
            <Link to="/schedule">
              <Button size="sm" variant="ghost">
                Schedule
              </Button>
            </Link>
          </nav>
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
