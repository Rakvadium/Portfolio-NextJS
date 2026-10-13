import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function GlassCapsule({ children, className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...rest} className="glass-ring shadow-float relative rounded-full p-px">
      <div className={cn("relative flex h-(--dock-row) rounded-full bg-canvas/80 p-0.5 backdrop-blur-xl", className)}>{children}</div>
    </div>
  );
}

export function CapsuleDivider() {
  return <span aria-hidden className="mx-0.5 h-6 w-px shrink-0 self-center bg-white/15" />;
}
