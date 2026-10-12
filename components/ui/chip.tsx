// Pill label for skills, core stack, and project technologies.
import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[13px] font-medium text-chip">
      {children}
    </span>
  );
}
