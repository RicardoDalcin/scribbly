/* eslint-disable react-refresh/only-export-components */
import { GraphicEngine } from '@/engine/GraphicEngine';
import type { EditorMode } from '@/engine/types';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

type EngineContext = {
  initialize: (canvas: HTMLCanvasElement, container: HTMLElement) => void;
  editorMode: EditorMode;
  changeEditorMode: (newEditorMode: EditorMode) => void;
};

const context = createContext<EngineContext>({
  initialize: () => {},
  editorMode: 'select',
  changeEditorMode: () => {},
});

const EngineProvider = ({ children }: { children: React.ReactNode }) => {
  const [editorMode, setEditorMode] = useState<EditorMode>('select');
  const engine = useRef<GraphicEngine | null>(null);

  const initialize = useCallback(
    (canvas: HTMLCanvasElement, container: HTMLElement) => {
      engine.current = new GraphicEngine(canvas, container);
    },
    []
  );

  const changeEditorMode = useCallback((newEditorMode: EditorMode) => {
    if (!engine.current) {
      return;
    }

    setEditorMode(newEditorMode);
    engine.current.changeEditorMode(newEditorMode);
  }, []);

  return (
    <context.Provider value={{ initialize, editorMode, changeEditorMode }}>
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
