import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-2">
      <h1 className="font-bold text-2xl">TARANG RIAN KMUTT</h1>
      <div className="flex gap-2 pt-2">
        <Link to="/courses">
          <Button variant="outline">All</Button>
        </Link>
      </div>
    </div>
  );
}
