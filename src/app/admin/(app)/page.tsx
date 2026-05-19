import { createClient } from "@/lib/supabase/server";
import { CUSTOMER_STATUSES } from "@/lib/validation";
import StatusBadge from "@/components/admin/StatusBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [totalRes, weekRes, allStatusRes, recentRes] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase.from("customers").select("status"),
    supabase
      .from("customers")
      .select("id,name,email,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const total = totalRes.count ?? 0;
  const newThisWeek = weekRes.count ?? 0;
  const statusCounts: Record<string, number> = Object.fromEntries(
    CUSTOMER_STATUSES.map((s) => [s, 0]),
  );
  for (const row of allStatusRes.data ?? []) {
    const s = row.status as string;
    statusCounts[s] = (statusCounts[s] ?? 0) + 1;
  }
  const recent = (recentRes.data ?? []) as CustomerRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Lead activity from your landing page.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total customers" value={total} />
        <StatCard label="New this week" value={newThisWeek} />
        <StatCard label="Qualified" value={statusCounts.qualified ?? 0} />
        <StatCard label="Won" value={statusCounts.won ?? 0} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">By status</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {CUSTOMER_STATUSES.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <StatusBadge status={s} />
              <span className="text-sm font-medium text-slate-700">
                {statusCounts[s] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Recent leads
          </h2>
          <Link
            href="/admin/customers"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No leads yet — submit the contact form on the landing page to see
            data here.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {recent.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="text-sm font-medium text-slate-900 hover:text-brand-700"
                  >
                    {c.name}
                  </Link>
                  <p className="text-xs text-slate-500">{c.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-slate-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}
