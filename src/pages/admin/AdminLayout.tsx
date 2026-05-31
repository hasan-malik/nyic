import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Film,
  Lock,
  RotateCcw,
  ShieldAlert,
  Users2,
} from "lucide-react";
import Logo from "../../components/Logo";
import { backendMode } from "../../lib/config";
import { store } from "../../lib/store";
import { useStories } from "../../lib/useStories";

const NAV = [
  { to: "/admin", label: "Overview", icon: BarChart3, end: true },
  { to: "/admin/review", label: "Review queue", icon: ShieldAlert },
  { to: "/admin/circles", label: "Belonging Circles", icon: Users2 },
  { to: "/admin/activation", label: "Activation", icon: Film },
];

export default function AdminLayout() {
  const [authed, setAuthed] = useState(() => {
    // Deep-link bypass (?staff=1) so the console can be demoed/shared directly.
    if (new URLSearchParams(window.location.search).get("staff") === "1") {
      sessionStorage.setItem("nyic_staff", "1");
      return true;
    }
    return sessionStorage.getItem("nyic_staff") === "1";
  });
  const stories = useStories();
  const reviewCount = stories.filter((s) => s.status === "in_review").length;

  if (!authed) {
    return <Gate onEnter={() => setAuthed(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy-ink p-5 text-white md:flex">
        <Link to="/">
          <Logo variant="white" />
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/40">
          Staff Console
        </p>

        <nav className="mt-8 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <item.icon size={18} /> {item.label}
              </span>
              {item.label === "Review queue" && reviewCount > 0 && (
                <span className="rounded-full bg-brand-red px-2 py-0.5 text-[11px] font-bold">
                  {reviewCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-lg bg-white/5 p-3 text-xs">
            <p className="font-semibold text-white/80">
              {backendMode === "live" ? "🟢 Live backend" : "🟡 Demo mode"}
            </p>
            <p className="mt-1 text-white/50">
              {backendMode === "live"
                ? "Connected to Supabase + live AI pipeline."
                : "Seeded data, no network. Add Supabase keys to go live."}
            </p>
          </div>
          <button
            onClick={() => {
              store.reset();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/60 hover:bg-white/5 hover:text-white"
          >
            <RotateCcw size={14} /> Reset demo data
          </button>
          <Link
            to="/"
            className="block px-3 text-xs text-white/40 hover:text-white/70"
          >
            ← Back to public site
          </Link>
        </div>
      </aside>

      {/* content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function Gate({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-ink px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <Lock size={24} />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-slate-900">
          NYIC Staff Console
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Story management, moderation, analytics, and community connection
          tools for the #IChooseNY ecosystem.
        </p>
        <button
          onClick={() => {
            sessionStorage.setItem("nyic_staff", "1");
            onEnter();
          }}
          className="mt-6 w-full rounded-lg bg-brand-red py-3 font-semibold text-white transition-colors hover:bg-brand-redHover"
        >
          Sign in as NYIC staff (demo)
        </button>
        <p className="mt-3 text-xs text-slate-400">
          Live deployment uses Supabase Auth with role-based access (RLS).
        </p>
      </div>
    </div>
  );
}
