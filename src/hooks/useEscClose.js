// useEscClose.js
import { useEffect } from "react";

export function useEscClose(callback, active = true) {
  useEffect(() => {
    if (!active) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        callback();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [callback, active]);
}
