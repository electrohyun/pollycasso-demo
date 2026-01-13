import type { RGBA } from '../model/types';
import {
  getPixelColor,
  hexToRgb,
  isColorMatch,
  isSameColor,
} from './colorUtils';
import { imageDataToImageElement } from './domUtils';

const TOLERANCE = 50;

const fillPixel = (
  data: Uint8ClampedArray,
  index: number,
  color: Omit<RGBA, 'a'>,
) => {
  data[index] = color.r;
  data[index + 1] = color.g;
  data[index + 2] = color.b;
  data[index + 3] = 255;
};

const applyFloodFill = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: Omit<RGBA, 'a'>,
): void => {
  const { width, height, data } = imageData;

  const stack = [[startX, startY]];
  const startPos = (startY * width + startX) * 4;
  const startColor = getPixelColor(data, startPos);

  if (isSameColor(startColor, fillColor)) {
    return;
  }

  const visited = new Uint8Array(width * height);

  while (stack.length) {
    const [x, y] = stack.pop()!;
    const pos = y * width + x;

    if (visited[pos]) continue;
    visited[pos] = 1;

    const pixelIndex = pos * 4;
    const currentColor = getPixelColor(data, pixelIndex);

    if (isColorMatch(startColor, currentColor, TOLERANCE)) {
      fillPixel(data, pixelIndex, fillColor);

      if (x > 0) stack.push([x - 1, y]);
      if (x < width - 1) stack.push([x + 1, y]);
      if (y > 0) stack.push([x, y - 1]);
      if (y < height - 1) stack.push([x, y + 1]);
    }
  }
};

export const performFloodFill = (
  originalImageData: ImageData,
  startX: number,
  startY: number,
  fillColorHex: string,
): HTMLImageElement | null => {
  const rgbColor = hexToRgb(fillColorHex);
  if (!rgbColor) return null;

  const workingImageData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height,
  );

  applyFloodFill(workingImageData, startX, startY, rgbColor);

  return imageDataToImageElement(workingImageData);
};
