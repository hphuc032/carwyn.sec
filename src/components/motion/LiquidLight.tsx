/** Inert until eligible pointer movement. No context/buffer allocation on touch or SSR. */
export function LiquidLight() {
  return <div className="liquid-surface" aria-hidden="true"><canvas className="liquid-light" width={1} height={1} /></div>;
}
