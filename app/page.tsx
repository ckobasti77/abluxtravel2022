import Link from "next/link";
import AlienShell from "../components/alien-shell";

const orbitTracks = [
  {
    title: "Neural Route Engine",
    copy: "Sistem bira najjace kombinacije let + hotel + lokalni transfer.",
  },
  {
    title: "Zero-Delay Dashboard",
    copy: "Ponude su spremne za live osvezavanje cim partneri otvore API pristup.",
  },
  {
    title: "Galaxy Price Mapping",
    copy: "Jedinstven model cena za brzo poredjenje razlicitih agencija.",
  },
];

export default function HomePage() {
  return (
    <AlienShell>
      <section className="grid gap-8 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-cyan-100/90">
            Pocetna Zona
          </p>
          <h1 className="max-w-2xl text-4xl uppercase tracking-[0.14em] text-cyan-50 sm:text-5xl lg:text-6xl">
            Turisticka stanica iz druge galaksije.
          </h1>
          <p className="max-w-xl text-base text-cyan-50/75 sm:text-lg">
            Kreirana da spoji premium aranzmane i buduci live feed ponuda iz vise
            partnerskih agencija u jedan sistem.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em]">
            <Link
              href="/putovanja"
              className="rounded-full border border-cyan-100/40 bg-cyan-100/10 px-6 py-3 text-cyan-100 transition hover:border-cyan-100/80"
            >
              Otvori Putovanja
            </Link>
            <Link
              href="/aranzmani"
              className="rounded-full border border-cyan-100/35 px-6 py-3 text-cyan-100/90 transition hover:border-cyan-100/70"
            >
              Otvori Aranzmane
            </Link>
            <Link
              href="/ponuda"
              className="rounded-full border border-cyan-100/30 px-6 py-3 text-cyan-100/85 transition hover:border-cyan-100/65"
            >
              Otvori Ponudu
            </Link>
          </div>
        </div>

        <div className="alien-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -right-14 bottom-0 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="relative space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
              Command Deck
            </p>
            <div className="grid gap-4">
              {orbitTracks.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-cyan-100/20 bg-cyan-100/5 p-4"
                >
                  <h2 className="text-sm uppercase tracking-[0.2em] text-cyan-50">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-cyan-50/70">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 pb-6 sm:grid-cols-3">
        <div className="alien-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
            Putovanja
          </p>
          <p className="mt-3 text-sm text-cyan-50/75">
            Vertikalni video slajder sa stavkama koje admin dodaje kroz panel.
          </p>
        </div>
        <div className="alien-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
            Aranzmani
          </p>
          <p className="mt-3 text-sm text-cyan-50/75">
            Premium prikaz putovanja sa cinematic hero blokovima.
          </p>
        </div>
        <div className="alien-panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
            Ponuda
          </p>
          <p className="mt-3 text-sm text-cyan-50/75">
            Agregator spreman za vise eksternih agencija i live update.
          </p>
        </div>
      </section>
    </AlienShell>
  );
}
