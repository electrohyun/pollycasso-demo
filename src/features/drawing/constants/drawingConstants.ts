export const DRAWING_CONSTANTS = {
  DEFAULT_TOOL: 'pen' as const,
  DEFAULT_COLOR: '#0C0C0C',
  DEFAULT_SIZE: 5,
  MIN_SIZE: 1,
  MAX_SIZE: 50,
} as const;

export const DRAWING_COLORS = [
  '#0C0C0C',
  '#FFFFFF',
  '#91D492',
  '#FF5D41',
  '#FFC6BC',
  '#34C6D0',
  '#EEC643',
  '#C9AAFF',
  '#FB3D89',
  '#3376FC',
] as const;

export const BRUSH_SIZES = [2, 5, 10, 20, 30] as const;
