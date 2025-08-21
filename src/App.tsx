import { useEffect, useRef } from 'react';
import { Toolbar } from './components/toolbar';
import { useEngine } from './stores/engine';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasInitialized = useRef(false);

  const { initialize } = useEngine();

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
    initialize(canvas, container);
  });

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-white relative"
    >
      <canvas ref={canvasRef} />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 shadow-sm shadow-black/5 border border-neutral-200/80 rounded-xl bg-white/90 backdrop-blur-lg">
        <Toolbar />
      </div>
    </div>
  );
}

export default App;
