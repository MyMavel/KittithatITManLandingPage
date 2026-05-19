import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
            New · Prototype release
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Run your IT business with one clean platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            KittithatITMan brings your customers, services and operations into a
            single dashboard — built for solo operators and growing IT teams.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Request access
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              View pricing →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
