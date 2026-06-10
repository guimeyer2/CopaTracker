import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Calendário", end: true },
  { to: "/stats", label: "Estatísticas" },
  { to: "/profile", label: "Perfil" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[57px] max-w-3xl items-center justify-between px-4">
        <NavLink to="/" className="group flex items-baseline gap-1.5">
          <span className="font-display text-xl font-bold tracking-tight">
            COPA
          </span>
          <span className="font-display text-xl font-medium tracking-tight text-amber">
            TRACKER
          </span>
          <span className="ml-1 self-start font-display text-[10px] font-semibold text-faint">
            '26
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-surface-2 text-bone"
                    : "text-muted hover:text-bone"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
