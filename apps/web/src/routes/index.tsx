import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Welcome to tarang-rian</h2>
          <p className="text-muted-foreground">Let's Plan your the schedule</p>
        </section>
      </div>
    </div>
  );
}
