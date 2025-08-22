import { cn } from '@/lib/utils';
import { useEngine } from '@/stores/engine';
import {
  MousePointerIcon,
  SquareIcon,
  DiamondIcon,
  CircleIcon,
  MoveRightIcon,
  MinusIcon,
  PencilIcon,
} from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

function ToolbarButton({
  icon: Icon,
  onClick,
  shortcut = '',
  active = false,
  fillOnActive,
}: {
  icon: React.ForwardRefExoticComponent<{
    size?: number;
    className?: string;
    strokeWidth?: number;
    fill?: string;
  }>;
  onClick: () => void;
  shortcut?: string;
  active?: boolean;
  fillOnActive?: boolean;
}) {
  useHotkeys(shortcut || [], onClick);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center size-9 rounded-md relative',
        'active:outline active:outline-indigo-500 focus:outline-transparent',
        {
          'hover:bg-indigo-50': !active,
          'bg-indigo-100': active,
        }
      )}
    >
      <Icon
        className={cn({
          'text-indigo-950': active,
          'text-neutral-900': !active,
        })}
        size={16}
        fill={
          active && fillOnActive ? 'var(--color-indigo-950)' : 'transparent'
        }
      />

      {shortcut && (
        <span
          className={cn('absolute bottom-1 right-1 text-[9px] leading-none', {
            'text-indigo-950/80': active,
            'text-neutral-400/80': !active,
          })}
        >
          {shortcut}
        </span>
      )}
    </button>
  );
}

export function Toolbar() {
  const { editorMode, changeEditorMode } = useEngine();

  return (
    <div className="flex items-center px-1 gap-1 h-11 shrink-0">
      <ToolbarButton
        fillOnActive
        icon={MousePointerIcon}
        onClick={() => {
          changeEditorMode('select');
        }}
        active={editorMode === 'select'}
        shortcut="1"
      />
      <ToolbarButton
        fillOnActive
        icon={SquareIcon}
        onClick={() => {
          changeEditorMode('rectangle');
        }}
        active={editorMode === 'rectangle'}
        shortcut="2"
      />
      <ToolbarButton
        fillOnActive
        icon={DiamondIcon}
        onClick={() => {
          changeEditorMode('diamond');
        }}
        active={editorMode === 'diamond'}
        shortcut="3"
      />
      <ToolbarButton
        fillOnActive
        icon={CircleIcon}
        onClick={() => {
          changeEditorMode('ellipse');
        }}
        active={editorMode === 'ellipse'}
        shortcut="4"
      />
      <ToolbarButton
        icon={MoveRightIcon}
        onClick={() => {
          changeEditorMode('arrow');
        }}
        active={editorMode === 'arrow'}
        shortcut="5"
      />
      <ToolbarButton
        icon={MinusIcon}
        onClick={() => {
          changeEditorMode('line');
        }}
        active={editorMode === 'line'}
        shortcut="6"
      />
      <ToolbarButton
        icon={PencilIcon}
        onClick={() => {
          changeEditorMode('draw');
        }}
        active={editorMode === 'draw'}
        shortcut="7"
      />
    </div>
  );
}
