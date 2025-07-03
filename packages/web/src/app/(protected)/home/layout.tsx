import HomeSidebar from '@/app/(protected)/home/_components/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
