import { DrawableTypes } from '@/engine/drawables';
import { cn } from '@/lib/utils';
import { useEngine } from '@/stores/engine';
import { SquareIcon } from 'lucide-react';
import React, { useMemo } from 'react';

function PropertyGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function PropertyLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-neutral-700">{children}</div>;
}

function PropertyColorItem({
  value,
  onClick,
  isActive = false,
}: {
  value: string | null;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn('rounded-[3px] size-[22px]', {
        'outline outline-offset-1 outline-indigo-950': isActive,
      })}
      style={
        value
          ? {
              backgroundColor: value,
            }
          : {
              backgroundImage: 'url(/transparent.png)',
              backgroundRepeat: 'repeat',
              border: '1px solid #e0e0e0',
            }
      }
    />
  );
}

function PropertyColor({
  options,
  value,
  onChange,
}: {
  options: Array<string | null>;
  value: string | null;
  onChange: (newValue: string | null) => void;
}) {
  return (
    <div className="flex gap-1 items-center justify-between w-full">
      <div className="flex gap-1 items-center">
        {options.map((option) => (
          <PropertyColorItem
            key={option}
            value={option}
            onClick={() => onChange(option)}
            isActive={option === value}
          />
        ))}
      </div>

      <hr className="h-[22px] w-px bg-neutral-100" />

      <PropertyColorItem value={value} />
    </div>
  );
}

function PropertyRadio<Option>({
  options,
  value,
  onChange,
}: {
  options: {
    value: Option;
    icon: React.ForwardRefExoticComponent<{ className: string }>;
  }[];
  value: Option;
  onChange: (newValue: Option) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      {options.map(({ value: optionValue, icon: Icon }) => (
        <button
          key={JSON.stringify(optionValue)}
          onClick={() => onChange(optionValue)}
          className={cn(
            'flex items-center justify-center rounded-sm size-8 focus:outline focus:outline-indigo-500',
            {
              'bg-gray-100 text-neutral-900': optionValue !== value,
              'bg-indigo-100 text-indigo-950': optionValue === value,
            }
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

export function LayerControls() {
  const { selectedObject, changeObjectStyle, objectStyle } = useEngine();

  const style = useMemo(() => {
    if (!objectStyle) {
      return {
        stroke: 'black',
        background: null,
        fillStyle: DrawableTypes.FillStyle.Hachure,
        strokeStyle: DrawableTypes.StrokeStyle.Solid,
        strokeWidth: DrawableTypes.StrokeWidth.Medium,
        sloppiness: DrawableTypes.Sloppiness.Medium,
        edges: DrawableTypes.Edges.Right,
        opacity: 1,
      };
    }

    return objectStyle;
  }, [objectStyle]);

  return (
    <div className="w-[200px] flex flex-col gap-4 px-3 py-3">
      <PropertyGroup>
        <PropertyLabel>Stroke</PropertyLabel>

        <PropertyColor
          options={['#000000', '#e03131', '#2f9e44', '#1971c2', '#f08c00']}
          value={style.stroke}
          onChange={(newValue) => {
            if (!selectedObject) {
              return;
            }

            changeObjectStyle(selectedObject.id, { stroke: newValue });
          }}
        />
      </PropertyGroup>

      <PropertyGroup>
        <PropertyLabel>Background</PropertyLabel>

        <PropertyColor
          options={[null, '#ffc9c9', '#b2f2bb', '#a5d8ff', '#ffec99']}
          value={style.background}
          onChange={(newValue) => {
            if (!selectedObject) {
              return;
            }

            changeObjectStyle(selectedObject.id, { background: newValue });
          }}
        />
      </PropertyGroup>

      {style.background && (
        <PropertyGroup>
          <PropertyLabel>Fill</PropertyLabel>

          <PropertyRadio
            options={[
              {
                value: DrawableTypes.FillStyle.Hachure,
                icon: SquareIcon,
              },
              {
                value: DrawableTypes.FillStyle.CrossHatch,
                icon: SquareIcon,
              },
              {
                value: DrawableTypes.FillStyle.Solid,
                icon: SquareIcon,
              },
            ]}
            value={style.fillStyle}
            onChange={(newValue) => {
              if (!selectedObject) {
                return;
              }

              changeObjectStyle(selectedObject.id, { fillStyle: newValue });
            }}
          />
        </PropertyGroup>
      )}

      <PropertyGroup>
        <PropertyLabel>Stroke width</PropertyLabel>

        <PropertyRadio
          options={[
            {
              value: DrawableTypes.StrokeWidth.Thin,
              icon: SquareIcon,
            },
            {
              value: DrawableTypes.StrokeWidth.Medium,
              icon: SquareIcon,
            },
            {
              value: DrawableTypes.StrokeWidth.Thick,
              icon: SquareIcon,
            },
          ]}
          value={style.strokeWidth}
          onChange={(newValue) => {
            if (!selectedObject) {
              return;
            }

            changeObjectStyle(selectedObject.id, { strokeWidth: newValue });
          }}
        />
      </PropertyGroup>

      <PropertyGroup>
        <PropertyLabel>Stroke style</PropertyLabel>

        <PropertyRadio
          options={[
            {
              value: DrawableTypes.StrokeStyle.Solid,
              icon: SquareIcon,
            },
            {
              value: DrawableTypes.StrokeStyle.Dashed,
              icon: SquareIcon,
            },
            {
              value: DrawableTypes.StrokeStyle.Dotted,
              icon: SquareIcon,
            },
          ]}
          value={style.strokeStyle}
          onChange={(newValue) => {
            if (!selectedObject) {
              return;
            }

            changeObjectStyle(selectedObject.id, { strokeStyle: newValue });
          }}
        />
      </PropertyGroup>

      <PropertyGroup>
        <PropertyLabel>Sloppiness</PropertyLabel>

        <PropertyRadio
          options={[
            {
              value: DrawableTypes.Sloppiness.Low,
              icon: SquareIcon,
            },
            {
              value: DrawableTypes.Sloppiness.Medium,
              icon: SquareIcon,
            },
            {
              value: DrawableTypes.Sloppiness.High,
              icon: SquareIcon,
            },
          ]}
          value={style.sloppiness}
          onChange={(newValue) => {
            if (!selectedObject) {
              return;
            }

            changeObjectStyle(selectedObject.id, { sloppiness: newValue });
          }}
        />
      </PropertyGroup>

      {/* <PropertyGroup>
        <PropertyLabel>Edges</PropertyLabel>

        <PropertyRadio
          options={[
            {
              value: DrawableTypes.Edges.Right,
              icon: SquareIcon,
            },
            {
              value: DrawableTypes.Edges.Angle,
              icon: SquareIcon,
            },
          ]}
          value={style.edges}
          onChange={(newValue) => {
            if (!selectedObject) {
              return;
            }

            changeObjectStyle(selectedObject.id, { edges: newValue });
          }}
        />
      </PropertyGroup>

      <PropertyGroup>
        <PropertyLabel>Opacity</PropertyLabel>
      </PropertyGroup> */}
    </div>
  );
}
