"use client";

import ThemeToggle from "./ThemeToggle";

export type View =
  | "overview"
  | "interview"
  | "team"
  | "progress"
  | "history"
  | "resume"
  | "vision";

export const NAV: { id: View; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "interview", label: "Interview" },
  { id: "team", label: "Team" },
  { id: "progress", label: "Progress" },
  { id: "history", label: "History" },
  { id: "resume", label: "Resume" },
  { id: "vision", label: "Vision" },
];

type Props = {
  view: View;
  onChange: (v: View) => void;
  email: string;
  onSignOut: () => void;
};

function initials(email: string) {
  return (email.split("@")[0] || "V").slice(0, 2).toUpperCase();
}

export default function Sidebar({ view, onChange, email, onSignOut }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="font-sidebar fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto border-r border-line bg-side md:flex">
        <button
          onClick={() => onChange("overview")}
          className="flex items-center gap-3 px-6 py-6 text-left"
        >
          <img
            src="/verve-logo.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full"
          />
          <span className="block">
            <span className="font-brand block text-3xl tracking-tight">Verve</span>
            <span className="block text-xs text-muted">fumble here, not there</span>
          </span>
        </button>
        <div className="px-4 pb-2">
          <ThemeToggle />
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => onChange(n.id)}
              className={
                "block w-full rounded-md border-l-2 px-3 py-2.5 text-left text-sm tracking-wide transition-colors " +
                (view === n.id
                  ? "border-accent bg-strong/60 text-ink"
                  : "border-transparent text-muted hover:text-ink")
              }
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="space-y-3 border-t border-line p-4">
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-strong text-xs font-semibold">
              {initials(email)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{email}</p>
              <button
                onClick={onSignOut}
                className="text-xs text-muted hover:text-ink"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="border-b border-line bg-side md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2">
            <img
              src="/verve-logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <span className="font-brand text-2xl tracking-tight">Verve</span>
          </span>
          <button onClick={onSignOut} className="text-xs text-muted">
            Sign out
          </button>
        </div>
        <nav className="font-sidebar flex gap-4 overflow-x-auto px-4 pb-2">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => onChange(n.id)}
              className={
                "shrink-0 border-b-2 pb-1 text-sm tracking-wide " +
                (view === n.id
                  ? "border-accent text-ink"
                  : "border-transparent text-muted")
              }
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="px-4 pb-3">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}