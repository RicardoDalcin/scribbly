import { useEngine } from '@/stores/engine';
import { MinusIcon, PlusIcon } from 'lucide-react';

export function ZoomControls() {
  const { zoom, changeZoom } = useEngine();

  function zoomOut() {
    changeZoom(zoom - 0.1);
  }

  function zoomIn() {
    changeZoom(zoom + 0.1);
  }

  function resetZoom() {
    changeZoom(1);
  }

  return (
    <div className="bg-gray-200 flex items-center rounded-lg overflow-hidden">
      <button
        className="size-9 flex items-center justify-center cursor-pointer outline-0"
        onClick={zoomOut}
      >
        <MinusIcon className="size-4" />
      </button>

      <button
        className="tabular-nums h-full w-20 text-sm cursor-pointer outline-0"
        onClick={resetZoom}
      >
        {Math.trunc(zoom * 100)}%
      </button>

      <button
        className="size-9 flex items-center justify-center cursor-pointer outline-0"
        onClick={zoomIn}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
