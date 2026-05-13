import { useEffect, useState } from "react";

export function useConnectionTimer(connectedAt: string | null): string | null {
  const [elapsed, setElapsed] = useState<string | null>(null);

  useEffect(() => {
    if (!connectedAt) {
      setElapsed(null);
      return;
    }

    const start = new Date(connectedAt).getTime();

    const tick = () => {
      const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setElapsed(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [connectedAt]);

  return elapsed;
}
