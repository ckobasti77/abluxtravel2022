import { ReactNode } from "react";

type AlienShellProps = {
  children: ReactNode;
  className?: string;
};

export default function AlienShell({ children, className = "" }: AlienShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden text-cyan-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-16 h-[360px] w-[360px] rounded-full bg-cyan-300/25 blur-[130px]" />
        <div className="absolute -right-24 top-24 h-[380px] w-[380px] rounded-full bg-indigo-400/25 blur-[150px]" />
        <div className="absolute bottom-[-120px] left-1/3 h-[360px] w-[420px] rounded-full bg-emerald-300/20 blur-[130px]" />
        <div className="alien-grid absolute inset-0 opacity-[0.08]" />
      </div>

      <main className={`relative z-20 mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-8 lg:px-12 ${className}`}>
        {children}
      </main>
    </div>
  );
}
