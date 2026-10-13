import { ArrowUpRight, Mail } from "lucide-react";
import type { ContactView } from "@/app/data/site";
import { ButtonLink } from "@/components/ui/button-link";
import { channelIcon } from "@/components/ui/icons";
import { Tile } from "@/components/ui/tile";

export function Contact({ contact }: { contact: ContactView }) {
  return (
    <Tile glow="magenta" motion="reveal">
      <div className="relative grid grid-cols-1 gap-8 overflow-hidden p-5 sm:p-10 lg:grid-cols-12">
        <div aria-hidden className="contact-glow pointer-events-none absolute -right-[287px] -top-[287px] size-[670px]" />
        <div className="relative lg:col-span-5">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl">
            Get in <span className="text-brand">touch</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-body sm:text-base">{contact.blurb}</p>
          <ButtonLink tone="brand" href={contact.email.href} icon={Mail} className="mt-6">
            Email me
          </ButtonLink>
        </div>
        <ul className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
          {contact.channels.map((channel) => {
            const Icon = channelIcon[channel.kind];
            return (
              <li key={channel.kind}>
                <a
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className="group/row flex items-center gap-3 rounded-2xl sm:gap-4 border border-white/[0.08] bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-peach">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-soft">{channel.label}</span>
                    <span className="block truncate text-[15px] font-semibold text-white">{channel.display}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-soft transition group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-white"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Tile>
  );
}
