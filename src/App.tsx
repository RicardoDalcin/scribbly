import { useEffect, useRef } from 'react';
import rough from 'roughjs';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container || hasInitialized.current) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    hasInitialized.current = true;

    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const rc = rough.canvas(canvas);
    rc.rectangle(10, 10, 200, 200, {
      fill: 'blue',
    });
  });

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-gray-50"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
