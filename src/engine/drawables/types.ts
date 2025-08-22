export type FillStyle = "hachure" | "cross-hatch" | "solid";
export const FillStyle: Record<string, FillStyle> = {
  Hachure: "hachure",
  CrossHatch: "cross-hatch",
  Solid: "solid",
};

export type StrokeWidth = "thin" | "medium" | "thick";
export const StrokeWidth: Record<string, StrokeWidth> = {
  Thin: "thin",
  Medium: "medium",
  Thick: "thick",
};
export const StrokeWidthValues: Record<StrokeWidth, number> = {
  thin: 1,
  medium: 2,
  thick: 3,
};

export type Sloppiness = "low" | "medium" | "high";
export const Sloppiness: Record<string, Sloppiness> = {
  Low: "low",
  Medium: "medium",
  High: "high",
};

export type Edges = "right" | "angle";
export const Edges: Record<string, Edges> = {
  Right: "right",
  Angle: "angle",
};
