export const DRAWING_CONSTANTS = {
  DEFAULT_TOOL: 'pen',
  DEFAULT_COLOR: '#0C0C0C',
  DEFAULT_SIZE: 5,
  MIN_SIZE: 1,
  MAX_SIZE: 100,
} as const;

export const DRAWING_TOOLS = [
  { id: 'pen', Icon: 'PencilIcon' },
  { id: 'brush', Icon: 'PaintBrushIcon' },
  { id: 'marker', Icon: 'MarkerIcon' },
] as const;

export const DRAWING_COLORS = [
  '#0C0C0C',
  '#FF7777',
  '#91D492',
  '#FFC6BC',
  '#F9E25D',
  '#22CEDA',
  '#6857FF',
  '#FFFFFF',
  '#FFA953',
  '#172E89',
  '#623A32',
  '#898F92',
  '#F060D6',
  '#C9AAFF',
];

export const BRUSH_SIZES = [1, 25, 50, 75, 100] as const;
