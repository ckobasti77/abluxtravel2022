import { ReactNode } from "react";

type AlienShellProps = {
  children: ReactNode;
  className?: string;
};

export default function AlienShell({ children, className = "" }: AlienShellProps) {
  return (
    <div className="site-shell">
      <div className="alien-shell-ambient pointer-events-none absolute inset-0 -z-10">
        <div className="alien-shell-glow alien-shell-glow--left" />
        <div className="alien-shell-glow alien-shell-glow--right" />
        <div className="alien-shell-glow alien-shell-glow--bottom" />
      </div>
      <main
        className={`mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-8 lg:px-12 ${className}`}
      >
        {children}
      </main>
    </div>
  );
}

