import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CUSTOMER_STATUSES, customerUpdateSchema } from "@/lib/validation";
import StatusBadge from "@/components/admin/StatusBadge";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

async function updateStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const parsed = customerUpdateSchema.safeParse({ status });
  if (!id || !parsed.success) return;
  await prisma.customer.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  redirect(`/admin/customers/${id}`);
}

async function deleteCustomer(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.customer.delete({ where: { id } });
  redirect("/admin/customers");
}

type Params = Promise<{ id: string }>;

export default async function CustomerDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {customer.name}
            </h1>
            <p className="text-sm text-slate-500">{customer.email}</p>
          </div>
          <StatusBadge status={customer.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label="Company" value={customer.company ?? "—"} />
          <Detail label="Source" value={customer.source} />
          <Detail
            label="Created"
            value={new Date(customer.createdAt).toLocaleString()}
          />
          <Detail
            label="Last updated"
            value={new Date(customer.updatedAt).toLocaleString()}
          />
        </dl>

        {customer.message && (
          <div className="mt-6">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Message
            </dt>
            <dd className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {customer.message}
            </dd>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Update status
        </h2>
        <form action={updateStatus} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={customer.id} />
          <select
            name="status"
            defaultValue={customer.status}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {CUSTOMER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Save
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-base font-semibold text-red-900">Danger zone</h2>
        <p className="mt-1 text-sm text-red-800">
          Permanently delete this customer record. This cannot be undone.
        </p>
        <form action={deleteCustomer} className="mt-4">
          <input type="hidden" name="id" value={customer.id} />
          <button
            type="submit"
            className="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Delete customer
          </button>
        </form>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-800">{value}</dd>
    </div>
  );
}
