import { HandTool } from "./hand";
import { RectangleTool } from "./rectangle";

export const Tools = [RectangleTool, HandTool] as const;

export type Tool = InstanceType<(typeof Tools)[number]>;
export type ToolId = Tool["id"];
