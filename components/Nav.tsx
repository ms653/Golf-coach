"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/lessons", label: "Lessons" },
  { href: "/sessions", label: "Sessions" },
  { href: "/rounds", label: "Rounds" },
  { href: "/progress", label: "Progress" },
  { href: "/stats", label: "Stats" },
  { href: "/goals", label: "Goals" },
  { href: "/bag-map", label: "Bag Map" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="bg-surface-deep">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-1 px-4 py-3">
        <span className="mr-4 font-display text-lg font-semibold text-ink-ondeep">
          Range Book
        </span>
        <nav className="flex flex-wrap gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-fairway-600 text-white"
                    : "text-ink-ondeep/70 hover:bg-white/10 hover:text-ink-ondeep"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
