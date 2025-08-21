export type Point = {
  x: number;
  y: number;
};

export type Tool =
  | 'select'
  | 'rectangle'
  | 'diamond'
  | 'ellipse'
  | 'arrow'
  | 'line'
  | 'draw'
  | 'text';
