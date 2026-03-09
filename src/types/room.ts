export type Direction = 'Left' | 'Right';

export interface Coordinate {
  r: number;
  c: number;
}

export interface Bounds {
  r1: number;
  r2: number;
  c1: number;
  c2: number;
}

export interface Item extends Bounds {
  id: number;
}
