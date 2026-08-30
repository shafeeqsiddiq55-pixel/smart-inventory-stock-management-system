import { useEffect, useState } from "react";

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    let bubbleId = 0;
    let lastTime = 0;

    const moveMouse = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const now = Date.now();

      if (now - lastTime > 100) {
        lastTime = now;

        const id = bubbleId++;

        setBubbles((prev) => [
          ...prev.slice(-7),
          {
            id,
            x: e.clientX,
            y: e.clientY,
            size: 8 + Math.random() * 10,
          },
        ]);

        setTimeout(() => {
          setBubbles((prev) =>
            prev.filter((bubble) => bubble.id !== id)
          );
        }, 1000);
      }
    };

    window.addEventListener("mousemove", moveMouse);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className="pointer-events-none fixed z-[9999] w-7 h-7 rounded-full bg-green-500/90 border-2 border-white shadow-[0_0_18px_rgba(34,197,94,0.7)] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: position.x,
          top: position.y,
        }}
      />

      {/* Bubble trail */}
      {bubbles.map((bubble, index) => (
        <span
          key={bubble.id}
          className={`pointer-events-none fixed z-[9998] rounded-full animate-ping ${
            index % 2 === 0
              ? "bg-green-400/40"
              : "bg-yellow-400/40"
          }`}
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
}