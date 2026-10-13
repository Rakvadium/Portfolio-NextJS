import type { ReactNode } from "react";
import { Layers, type LucideIcon } from "lucide-react";
import type { Fact } from "@/app/data/site";
import { Chip } from "@/components/ui/chip";
import { factIcon } from "@/components/ui/icons";

export function QuickFacts({ facts, coreStack }: { facts: readonly Fact[]; coreStack: readonly string[] }) {
  return (
    <div>
      <h2 className="mb-2.5 text-sm font-semibold text-soft">Quick facts</h2>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <FactRow key={fact.kind} icon={factIcon[fact.kind]} label={fact.label}>
            <dd className="text-[15px] font-medium leading-snug text-ink">
              {fact.value}
              {fact.detail && <span className="ml-1.5 font-normal text-soft">({fact.detail})</span>}
            </dd>
          </FactRow>
        ))}
        <FactRow icon={Layers} label="Core stack, what I work in most">
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {coreStack.map((skill) => (
              <Chip key={skill}>{skill}</Chip>
            ))}
          </dd>
        </FactRow>
      </dl>
    </div>
  );
}

function FactRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="relative min-w-0 pl-11">
      <dt className="text-[13px] text-soft">
        <span className="absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-peach">
          <Icon aria-hidden className="h-4 w-4" />
        </span>
        {label}
      </dt>
      {children}
    </div>
  );
}
