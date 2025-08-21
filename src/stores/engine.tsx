/* eslint-disable react-refresh/only-export-components */
import { GraphicEngine } from '@/engine/GraphicEngine';
import type { Tool } from '@/engine/types';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

type EngineContext = {
  initialize: (canvas: HTMLCanvasElement, container: HTMLElement) => void;
  tool: Tool;
  changeTool: (newTool: Tool) => void;
};

const context = createContext<EngineContext>({
  initialize: () => {},
  tool: 'select',
  changeTool: () => {},
});

const EngineProvider = ({ children }: { children: React.ReactNode }) => {
  const [tool, setTool] = useState<Tool>('select');
  const engine = useRef<GraphicEngine | null>(null);

  const initialize = useCallback(
    (canvas: HTMLCanvasElement, container: HTMLElement) => {
      engine.current = new GraphicEngine(canvas, container);
    },
    []
  );

  const changeTool = useCallback(
    (newTool: Tool) => {
      if (!engine.current) {
        return;
      }

      setTool(newTool);
      engine.current.changeTool(newTool);
    },
    [setTool]
  );

  return (
    <context.Provider value={{ initialize, tool, changeTool }}>
      {children}
    </context.Provider>
  );
};

const useEngine = () => {
  const values = useContext(context);

  if (!values) {
    throw new Error('useEngine must be used within an EngineProvider');
  }

  return values;
};

export { EngineProvider, useEngine };
