export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 pb-12 pt-28">
        <h1 className="text-4xl uppercase tracking-[0.2em]">Kontakt</h1>
        <div className="mt-8 grid gap-4 text-sm text-white/75 sm:text-base">
          <p>Email: info@abluxtravel2022.rs</p>
          <p>Telefon: +381 11 123 45 67</p>
          <p>Adresa: Bulevar Putnika 22, Beograd</p>
          <p>Radno vreme: Pon - Pet, 09:00 - 17:00</p>
        </div>
      </div>
    </div>
  );
}
