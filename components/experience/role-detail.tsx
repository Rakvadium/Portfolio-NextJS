// Role markup shared by the explorer and the accordion, so the two layouts cannot drift.
// Server components: both client islands receive these as rendered slots.
import type { RoleView } from "@/app/data/site";
import { cn } from "@/lib/utils";

/**
 * Years / title / company: the explorer tab label and the accordion summary. Active styling comes
 * from the parent's ARIA state through group variants (aria-selected on a tab, aria-expanded on the
 * accordion button), not from props, so the node can be rendered once on the server.
 */
export function RoleSummary({ role, variant }: { role: RoleView; variant: "tab" | "summary" }) {
  return (
    <span className="relative block min-w-0">
      <span className="block text-sm text-soft group-aria-selected:text-apricot group-aria-expanded:text-apricot">
        {role.years}
      </span>
      <span
        className={cn(
          "block font-semibold leading-snug",
          variant === "tab" ? "text-[16px] text-mute group-aria-selected:text-white" : "text-[17px] text-white",
        )}
      >
        {role.title}
      </span>
      <span className="block text-sm text-soft">{role.company}</span>
    </span>
  );
}

/**
 * Explorer panel: "dates · location", h3 title, company, "What I did", highlights.
 * `compact` (accordion body) keeps only the dates line and the highlights: the summary above it
 * already shows the title and company.
 */
export function RoleDetail({ role, compact = false }: { role: RoleView; compact?: boolean }) {
  return (
    <>
      <p className="text-sm text-soft">
        {role.dates} · {role.location}
      </p>
      {!compact && (
        <>
          <h3 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight lg:text-4xl">{role.title}</h3>
          <p className="mt-1 text-lg text-chip">{role.company}</p>
          <h4 className="mt-6 text-sm font-semibold text-soft">What I did</h4>
        </>
      )}
      <ul className="mt-3 space-y-3">
        {role.highlights.map((highlight) => (
          <li key={highlight} className={cn("flex gap-3 text-[15px] leading-relaxed text-body", !compact && "lg:text-base")}>
            <span aria-hidden className={cn("bg-brand mt-[0.75em] h-[2px] shrink-0 rounded-full", compact ? "w-3.5" : "w-4")} />
            {highlight}
          </li>
        ))}
      </ul>
    </>
  );
}
