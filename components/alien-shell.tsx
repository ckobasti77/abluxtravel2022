import { ReactNode } from "react";

type AlienShellProps = {
  children: ReactNode;
  className?: string;
};

export default function AlienShell({ children, className = "" }: AlienShellProps) {
  return (
    <div className="site-shell">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-[#3b82f622] blur-[120px]" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-[#14b8a622] blur-[120px]" />
        <div className="absolute bottom-[-140px] left-1/3 h-80 w-[26rem] rounded-full bg-[#155eef1c] blur-[140px]" />
      </div>
      <main
        className={`mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-8 lg:px-12 ${className}`}
      >
        {children}
      </main>
    </div>
  );
}

