"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { useCurrentDay } from "@/lib/hooks";
import { TOTAL_DAYS } from "@/lib/constants";
import { PWA } from "./PWA";

const NAV = [
  { href: "/", label: "Today", icon: "◎" },
  { href: "/progress", label: "Progress", icon: "▤" },
  { href: "/history", label: "History", icon: "◷" },
  { href: "/settings", label: "Setup", icon: "⚙" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const init = useStore((s) => s.init);
  const day = useCurrentDay();

  // Ensure recording counts are loaded from IndexedDB on first mount.
  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-32 pt-5 sm:px-6">
      <PWA />
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-600 text-lg font-black text-ink-950 shadow-glow-sm transition group-hover:shadow-glow">
            T
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">TOEIC SPEAKING</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
              Execution System
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-1.5 text-right backdrop-blur">
          <div>
            <p className="font-mono text-sm font-bold leading-none text-accent">
              DAY {day || "—"}
              <span className="text-gray-600"> / {TOTAL_DAYS}</span>
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-gray-500">No excuses</p>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
        <div className="mx-auto flex max-w-md items-stretch justify-around gap-1 rounded-2xl border border-slate-200 bg-white/85 p-1.5 shadow-card backdrop-blur-xl">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2.5 text-[11px] font-semibold transition-all ${
                  active
                    ? "bg-accent/10 text-accent shadow-[inset_0_0_0_1px_rgba(13,139,224,0.25)]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
