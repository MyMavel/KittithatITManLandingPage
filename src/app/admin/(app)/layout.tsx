import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header user={session.sub} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
