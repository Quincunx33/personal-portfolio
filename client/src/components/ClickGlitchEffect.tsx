import { useEffect, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
}

export function ClickGlitchEffect() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger glitch if clicking inside inputs or textareas for better usability
      const target = e.target as HTMLElement;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      // Add glitch class to body or site-shell
      document.body.classList.add("glitch-active");
      setTimeout(() => {
        document.body.classList.remove("glitch-active");
      }, 250);

      // Add a visual glitch spark at click position
      const newSpark: Spark = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setSparks((prev) => [...prev.slice(-4), newSpark]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, 350);
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="click-glitch-spark"
          style={{ left: `${spark.x}px`, top: `${spark.y}px` }}
        />
      ))}
    </>
  );
}
