"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "../../lib/local-auth";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = signUp(username.trim(), password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6">
        <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase">
          Sign Up
        </h1>
        <p className="mt-3 text-sm text-white/70">
          Kreiraj nalog i sacuvaj omiljena putovanja.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-4"
        >
          <input
            className="h-12 rounded-xl border border-white/20 bg-white/5 px-4 text-sm outline-none transition focus:border-white/60"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <input
            className="h-12 rounded-xl border border-white/20 bg-white/5 px-4 text-sm outline-none transition focus:border-white/60"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? (
            <p className="text-sm text-rose-300">{error}</p>
          ) : null}
          <button
            type="submit"
            className="mt-2 h-12 rounded-xl border border-white/40 text-xs uppercase tracking-[0.35em] transition hover:border-white"
          >
            Kreiraj nalog
          </button>
        </form>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-white/60">
          Vec imas nalog?{" "}
          <Link href="/signin" className="text-white">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
