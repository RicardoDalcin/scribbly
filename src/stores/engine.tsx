/* eslint-disable react-refresh/only-export-components */
import type { Drawable } from '@/engine/drawables';
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
  selectedObject: Drawable | null;
  objectStyle: Drawable['style'] | null;
  changeObjectStyle: (
    objectId: string,
    newStyle: Partial<Drawable['style']>
  ) => void;
};

const context = createContext<EngineContext>({
  initialize: () => {},
  editorMode: 'select',
  changeEditorMode: () => {},
  isDragging: false,
  zoom: 1,
  changeZoom: () => {},
  selectedObject: null,
  objectStyle: null,
  changeObjectStyle: () => {},
});

const EngineProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [editorMode, setEditorMode] = useState<EditorMode>('select');
  const [selectedObject, setSelectedObject] = useState<Drawable | null>(null);
  const [objectStyle, setObjectStyle] = useState<Drawable['style'] | null>(
    null
  );
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
        onChangeSelectedObject: (newSelectedObject: Drawable | null) => {
          setSelectedObject(newSelectedObject);
          setObjectStyle(newSelectedObject?.style ?? null);
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

  const changeObjectStyle = useCallback(
    (objectId: string, newStyle: Partial<Drawable['style']>) => {
      if (!engine.current) {
        return;
      }

      engine.current.changeObjectStyle(objectId, newStyle);
    },
    []
  );

  return (
    <context.Provider
      value={{
        initialize,
        editorMode,
        changeEditorMode,
        isDragging,
        zoom,
        changeZoom,
        selectedObject,
        objectStyle,
        changeObjectStyle,
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
