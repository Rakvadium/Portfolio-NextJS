// The fixed decorative layer behind the page: three blurred brand-color blobs and a dot grid that
// fades out from the top.
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-48 -top-48 h-[620px] w-[620px] rounded-full bg-amber/10 blur-[140px]" />
      <div className="absolute -right-48 top-1/4 h-[560px] w-[560px] rounded-full bg-coral/10 blur-[150px]" />
      <div className="absolute -bottom-64 left-1/3 h-[520px] w-[520px] rounded-full bg-magenta/10 blur-[160px]" />
      <div className="backdrop-dots absolute inset-0 opacity-60" />
    </div>
  );
}
