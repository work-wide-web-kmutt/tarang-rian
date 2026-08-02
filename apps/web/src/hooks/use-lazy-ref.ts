import { useState } from "react";

function useLazyRef<T>(fn: () => T): { current: T } {
  // oxlint-disable-next-line react/hook-use-state -- use state as a lazy stable container without setter
  const [ref] = useState(() => ({ current: fn() }));
  return ref;
}

export { useLazyRef };
