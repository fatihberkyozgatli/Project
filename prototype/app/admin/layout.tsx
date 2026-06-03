import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
