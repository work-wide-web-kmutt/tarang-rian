import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/footer";
import { Header } from "@/components/header";

export const Route = createFileRoute("/(public)")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <>
      <div className="relative min-h-dvh">
        <div className="absolute inset-x-0 top-0 bottom-0 z-0">
          <div className="container mx-auto h-full max-w-8xl bg-background px-12">
            <div className="h-full w-full border-border border-x-2 border-dashed" />
          </div>
        </div>
        <div className="relative z-10">
          <Header />
          <div className="w-full overflow-x-clip border-border border-t-2 border-dashed">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
