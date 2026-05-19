import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$19",
    cadence: "/month",
    description: "For solo operators getting their first customers organised.",
    features: [
      "Up to 100 customers",
      "1 admin user",
      "Email contact form",
      "Community support",
    ],
    cta: "Start with Starter",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    cadence: "/month",
    description: "For growing IT teams that need more horsepower and seats.",
    features: [
      "Up to 5,000 customers",
      "5 admin users",
      "Status pipeline & search",
      "Priority email support",
    ],
    cta: "Try Pro free",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "Tailored deployment, SSO, custom workflows and SLAs.",
    features: [
      "Unlimited customers",
      "Unlimited admin users",
      "SSO & custom roles",
      "Dedicated success manager",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, predictable pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start small and upgrade as you grow. All plans include the core
            customer workspace.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${
                tier.highlighted
                  ? "border-brand-500 ring-2 ring-brand-500"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {tier.name}
                </h3>
                {tier.highlighted && (
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  {tier.price}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  {tier.cadence}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  tier.highlighted
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-slate-300 text-slate-900 hover:border-brand-500 hover:text-brand-700"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
