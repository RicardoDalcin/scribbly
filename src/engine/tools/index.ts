import { HandTool } from './hand';
import { RectangleTool } from './rectangle';
import { SelectionTool } from './selection';

export const Tools = [RectangleTool, HandTool, SelectionTool] as const;

export type Tool = InstanceType<(typeof Tools)[number]>;
export type ToolId = Tool['id'];
