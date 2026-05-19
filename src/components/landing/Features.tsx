import { Boxes, ShieldCheck, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: Boxes,
    title: "All-in-one workspace",
    description:
      "Customers, services, and projects live side by side so nothing slips through the cracks.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Role-based access, signed sessions and audit-ready logs are built into the platform.",
  },
  {
    icon: BarChart3,
    title: "Real-time insights",
    description:
      "Lead flow, conversion and revenue dashboards refresh as your team works.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "Designed to feel instant. Navigate with the keyboard, ship in seconds.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to run IT, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A focused toolkit for IT professionals — replace the spreadsheet
            sprawl with one workspace.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-sm"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
