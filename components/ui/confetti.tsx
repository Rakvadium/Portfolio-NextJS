"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";

type Api = {
  fire: (options?: ConfettiOptions) => void;
};

type ConfettiProps = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
  children?: ReactNode;
};

export type ConfettiRef = Api | null;

const ConfettiContext = createContext<Api>({} as Api);

const ConfettiComponent = forwardRef<ConfettiRef, ConfettiProps>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    ...rest
  } = props;
  const instanceRef = useRef<ConfettiInstance | null>(null);

  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node !== null) {
        if (instanceRef.current) return;
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions]
  );

  const fire = useCallback(
    async (opts = {}) => {
      try {
        await instanceRef.current?.({ ...options, ...opts });
      } catch (error) {
        console.error("Confetti error:", error);
      }
    },
    [options]
  );

  const api = useMemo(
    () => ({
      fire,
    }),
    [fire]
  );

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) {
      void (async () => {
        try {
          await fire();
        } catch (error) {
          console.error("Confetti effect error:", error);
        }
      })();
    }
  }, [manualstart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  );
});

ConfettiComponent.displayName = "Confetti";

export const Confetti = ConfettiComponent;

const defaultClickOptions: ConfettiOptions = {
  particleCount: 120,
  spread: 80,
  startVelocity: 45,
  ticks: 220,
  colors: ["#22d3ee", "#06b6d4", "#67e8f9", "#a5f3fc", "#cffafe", "#f472b6"],
};

export function fireConfettiFromClick(
  event: React.MouseEvent<HTMLElement>,
  options?: ConfettiOptions
) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  void confetti({
    ...defaultClickOptions,
    ...options,
    origin: { x, y },
  });
}

interface ConfettiButtonProps extends React.ComponentProps<"button"> {
  options?: ConfettiOptions & ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
}

export function ConfettiButton({ options, children, onClick, ...props }: ConfettiButtonProps) {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClick?.(event);
      return;
    }
    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      await confetti({
        ...defaultClickOptions,
        ...options,
        origin: { x, y },
      });
    } catch (error) {
      console.error("Confetti button error:", error);
    }
    onClick?.(event);
  };

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

ConfettiButton.displayName = "ConfettiButton";
