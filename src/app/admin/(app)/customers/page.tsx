import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string }>;

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  status: string;
  created_at: string;
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const supabase = await createClient();
  let req = supabase
    .from("customers")
    .select("id,name,email,company,status,created_at")
    .order("created_at", { ascending: false });

  if (query) {
    const pattern = `%${query.replace(/[%_]/g, "")}%`;
    req = req.or(
      `name.ilike.${pattern},email.ilike.${pattern},company.ilike.${pattern}`,
    );
  }

  const { data, error } = await req;
  const customers = ((!error && data) || []) as CustomerRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customers
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Leads captured from your landing page.
          </p>
        </div>
      </div>

      <form
        method="GET"
        className="flex max-w-md items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500"
      >
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by name, email or company..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        {query && (
          <Link
            href="/admin/customers"
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {customers.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            {query
              ? `No customers match “${query}”.`
              : "No customers yet — submit the contact form to populate this list."}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Company</Th>
                <Th>Status</Th>
                <Th>Created</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-medium text-slate-900 hover:text-brand-700"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.company ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}
