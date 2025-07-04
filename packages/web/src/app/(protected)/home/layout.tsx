import HomeSidebar from "@/app/(protected)/home/_components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <main className="flex h-full shrink-0 items-start justify-start gap-2 p-3">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
