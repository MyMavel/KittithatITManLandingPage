import type { CustomerStatus } from "@/lib/validation";

const styles: Record<CustomerStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-amber-50 text-amber-800 ring-amber-200",
  qualified: "bg-violet-50 text-violet-700 ring-violet-200",
  won: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost: "bg-slate-100 text-slate-600 ring-slate-200",
};

const labels: Record<CustomerStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

export default function StatusBadge({ status }: { status: string }) {
  const key = (status as CustomerStatus) in styles ? (status as CustomerStatus) : "new";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[key]}`}
    >
      {labels[key]}
    </span>
  );
}
