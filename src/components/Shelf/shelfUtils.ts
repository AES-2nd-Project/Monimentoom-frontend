import type { Bounds, Coordinate } from '../../types/room';

export const getItemGridCoord = ({ r1, r2 = r1, c1, c2 = c1 }: Bounds) => ({
  // row는 divider가 끼어 있기 때문에 2배씩 건너뜀
  gridRowStart: r1 * 2 + 1,
  gridRowEnd: r2 * 2 + 2,
  gridColumnStart: c1 + 1,
  gridColumnEnd: c2 + 2,
});

export const getDividerGridCoord = ({ r, c }: Coordinate) => ({
  gridRowStart: r * 2 + 2,
  gridRowEnd: r * 2 + 3,
  gridColumnStart: c + 1,
  gridColumnEnd: c + 2,
});
