import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.full_name ?? profile?.email ?? user.email ?? "Admin";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header user={displayName} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
