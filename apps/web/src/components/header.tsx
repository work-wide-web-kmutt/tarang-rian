import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const currentTheme = theme ?? "system";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
        <div className="hidden sm:block">
          <ThemeSwitcher />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "sm:hidden"
            )}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Links</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: "/courses" })}>
                All courses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/schedule" })}>
                Schedule
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System theme
                {currentTheme === "system" && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light theme
                {currentTheme === "light" && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark theme
                {currentTheme === "dark" && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
