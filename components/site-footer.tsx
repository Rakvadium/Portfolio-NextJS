// `copyright` already carries the year, computed on the server: no client clock.
import type { FooterView } from "@/app/data/site";

export function SiteFooter({ footer }: { footer: FooterView }) {
  return (
    <footer className="mt-12 flex flex-col justify-between gap-2 text-sm text-soft sm:flex-row">
      <span>{footer.copyright}</span>
      <span>{footer.tagline}</span>
    </footer>
  );
}
