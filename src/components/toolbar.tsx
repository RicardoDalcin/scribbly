import { cn } from "@/lib/utils";
import {
  PointerIcon,
  SquareIcon,
  DiamondIcon,
  CircleIcon,
  MoveRightIcon,
  MinusIcon,
  PencilIcon,
} from "lucide-react";

function ToolbarButton({
  icon: Icon,
  onClick,
  shortcut = "",
  active = false,
}: {
  icon: React.ForwardRefExoticComponent<{ className: string }>;
  onClick: () => void;
  shortcut?: string;
  active?: boolean;
}) {
  return (
    <button
      onPointerDown={onClick}
      className={cn("flex items-center justify-center size-8 rounded-md", {
        "hover:bg-indigo-200 active:outline active:outline-indigo-500": !active,
        "bg-indigo-300": active,
      })}
    >
      <Icon className="size-5 text-indigo-950" />
    </button>
  );
}

export function Toolbar() {
  return (
    <div className="flex items-center px-3 gap-2 h-12 shrink-0">
      <ToolbarButton icon={PointerIcon} onClick={() => {}} active />
      <ToolbarButton icon={SquareIcon} onClick={() => {}} />
      <ToolbarButton icon={DiamondIcon} onClick={() => {}} />
      <ToolbarButton icon={CircleIcon} onClick={() => {}} />
      <ToolbarButton icon={MoveRightIcon} onClick={() => {}} />
      <ToolbarButton icon={MinusIcon} onClick={() => {}} />
      <ToolbarButton icon={PencilIcon} onClick={() => {}} />
    </div>
  );
}
