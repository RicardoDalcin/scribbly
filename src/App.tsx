import { useEffect, useRef } from 'react';
import { Toolbar } from './components/toolbar';
import { useEngine } from './stores/engine';
import { cn } from './lib/utils';
import { ZoomControls } from './components/zoom-controls';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasInitialized = useRef(false);

  const { initialize, isDragging } = useEngine();

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
      className={cn('w-screen h-screen overflow-hidden bg-white relative', {
        'cursor-grabbing': isDragging,
      })}
    >
      <canvas ref={canvasRef} />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 shadow-sm shadow-black/5 border border-neutral-200/80 rounded-xl bg-white/90 backdrop-blur-lg">
        <Toolbar />
      </div>

      <div className="absolute bottom-4 left-4">
        <ZoomControls />
      </div>
    </div>
  );
}

export default App;
