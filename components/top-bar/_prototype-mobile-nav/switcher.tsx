"use client";
// PROTOTYPE switcher: cycles `?nav=` with the arrows or ←/→. Hidden on the Vercel production deploy.
import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Variant = { readonly key: string; readonly name: string };

export function PrototypeSwitcher({ variants, current }: { variants: readonly Variant[]; current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const index = Math.max(0, variants.findIndex((v) => v.key === current));
  const variant = variants[index];

  const go = useCallback(
    (delta: number) => {
      const next = variants[(index + delta + variants.length) % variants.length];
      const q = new URLSearchParams(params.toString());
      if (next.key === "current") q.delete("nav");
      else q.set("nav", next.key);
      const qs = q.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}${window.location.hash}`, { scroll: false });
    },
    [index, params, pathname, router, variants],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable], [role=tablist]")) return;
      go(e.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div
      data-prototype-switcher
      className="fixed left-1/2 z-[55] flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-[#ff2d8a] p-1 text-[13px] font-semibold text-white shadow-[0_8px_24px_-6px_rgb(0_0_0/0.8)] ring-2 ring-white/90 max-lg:bottom-[calc(env(safe-area-inset-bottom,0px)+100px)] lg:bottom-4"
    >
      <button type="button" onClick={() => go(-1)} aria-label="Previous nav variant" className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20">
        <ChevronLeft aria-hidden className="h-4 w-4" />
      </button>
      <span className="whitespace-nowrap px-1.5 tabular-nums">
        {variant.key === "current" ? "current" : variant.key} · {variant.name}
      </span>
      <button type="button" onClick={() => go(1)} aria-label="Next nav variant" className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20">
        <ChevronRight aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
