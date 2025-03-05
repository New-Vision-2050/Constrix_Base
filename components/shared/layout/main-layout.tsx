import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SparklesCore } from "@/modules/auth/components/sparkles-core";
import { AppSidebar } from "./app-sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative">
      <SparklesCore
        id="tsparticlesfullpage"
        background="#18003A"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="h-full w-full absolute -z-20"
        particleColor="#FFFFFF"
      />{" "}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          {children}{" "}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
