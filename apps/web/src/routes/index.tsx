import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-bold text-2xl">Welcome to TARANG RIAN KMUTT</h1>
      <p className="mt-4 text-muted-foreground">
        Browse and select General Education elective courses for your schedule.
      </p>
    </div>
  );
}
