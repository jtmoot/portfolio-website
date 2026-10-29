import { useCallback, useEffect, useRef, useState } from "react";

/** How long a station stays "hovered" after the pointer leaves, so the card can be reached. */
export const LINGER_MS = 2000;

/**
 * A hover id that lingers: leave() only clears it after LINGER_MS, and enter() cancels that.
 * @returns {{ id: string | null, enter: (id: string) => void, leave: () => void }}
 */
export function useLinger() {
  const [id, setId] = useState(null);
  const timer = useRef(0);
  const cancel = () => {
    clearTimeout(timer.current);
    timer.current = 0;
  };
  const enter = useCallback((next) => {
    cancel();
    setId(next);
  }, []);
  const leave = useCallback(() => {
    cancel();
    timer.current = setTimeout(() => setId(null), LINGER_MS);
  }, []);
  useEffect(() => cancel, []);
  return { id, enter, leave };
}
