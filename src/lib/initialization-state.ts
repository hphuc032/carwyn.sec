type InitializationState = "pending" | "running" | "ready";
let state: InitializationState = "pending";
const listeners = new Set<() => void>();
export const getInitializationState = () => state;
export const getServerInitializationState = (): InitializationState => "pending";
export function subscribeInitialization(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function setInitializationState(next: InitializationState) {
  if (state === next) return;
  state = next;
  listeners.forEach((listener) => listener());
}
