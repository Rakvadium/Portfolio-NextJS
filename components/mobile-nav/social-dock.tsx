// Phone dock, right capsule: the outbound channels as round icon links, then a divider and Email
// (amber, the primary action).
import type { Channel } from "@/app/data/site";
import { channelIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { CapsuleDivider, GlassCapsule } from "./glass-capsule";

export function SocialDock({ channels }: { channels: readonly Channel[] }) {
  const email = channels.filter((c) => c.kind === "email");
  const others = channels.filter((c) => c.kind !== "email");
  return (
    <GlassCapsule role="group" aria-label="Social links" className="items-center gap-0.5">
      {others.map((c) => (
        <DockLink key={c.kind} channel={c} />
      ))}
      {email.length > 0 && others.length > 0 && <CapsuleDivider />}
      {email.map((c) => (
        <DockLink key={c.kind} channel={c} primary />
      ))}
    </GlassCapsule>
  );
}

function DockLink({ channel, primary = false }: { channel: Channel; primary?: boolean }) {
  const Icon = channelIcon[channel.kind];
  return (
    <a
      href={channel.href}
      aria-label={channel.accessibleName}
      title={channel.accessibleName}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      className={cn(
        "relative flex size-(--dock-act) shrink-0 items-center justify-center rounded-full transition-[color,background-color,transform] duration-150 motion-safe:active:scale-95",
        primary ? "text-amber hover:bg-amber/10" : "text-ink hover:bg-white/[0.08]",
      )}
    >
      <Icon aria-hidden strokeWidth={2.25} className="size-(--dock-icon)" />
    </a>
  );
}
