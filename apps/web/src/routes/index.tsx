import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Logo />
      <div className="text-4xl">LET’S PLAN BEFORE</div>
      <div className="font-bold text-4xl">THE RACE START.</div>
    </div>
  );
}
