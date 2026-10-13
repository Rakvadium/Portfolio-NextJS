import type { Channel } from "@/app/data/site";
import { channelIcon } from "@/components/ui/icons";

export function SocialLinks({ channels }: { channels: readonly Channel[] }) {
  return (
    <ul className="flex shrink-0 items-center gap-1 sm:gap-1.5">
      {channels.map((c) => {
        const Icon = channelIcon[c.kind];
        return (
          <li key={c.kind}>
            <a
              href={c.href}
              aria-label={c.accessibleName}
              title={c.accessibleName}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-chip transition hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
            >
              <Icon aria-hidden className="h-4 w-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
