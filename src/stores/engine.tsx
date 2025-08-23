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
  isDragging: boolean;
  zoom: number;
  changeZoom: (newZoom: number) => void;
};

const context = createContext<EngineContext>({
  initialize: () => {},
  editorMode: 'select',
  changeEditorMode: () => {},
  isDragging: false,
  zoom: 1,
  changeZoom: () => {},
});

const EngineProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [editorMode, setEditorMode] = useState<EditorMode>('select');
  const engine = useRef<GraphicEngine | null>(null);

  const initialize = useCallback(
    (canvas: HTMLCanvasElement, container: HTMLElement) => {
      engine.current = new GraphicEngine(canvas, container, {
        onChangeEditorMode: (newEditorMode: EditorMode) => {
          setEditorMode(newEditorMode);
        },
        onChangeIsDragging: (isDragging: boolean) => {
          setIsDragging(isDragging);
        },
        onChangeZoom: (newZoom: number) => {
          setZoom(newZoom);
        },
      });

      return () => {
        engine.current?.destroy();
      };
    },
    []
  );

  const changeEditorMode = useCallback((newEditorMode: EditorMode) => {
    if (!engine.current) {
      return;
    }

    engine.current.changeEditorMode(newEditorMode);
  }, []);

  const changeZoom = useCallback((newZoom: number) => {
    if (!engine.current) {
      return;
    }

    engine.current.setZoom(newZoom);
  }, []);

  return (
    <context.Provider
      value={{
        initialize,
        editorMode,
        changeEditorMode,
        isDragging,
        zoom,
        changeZoom,
      }}
    >
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
