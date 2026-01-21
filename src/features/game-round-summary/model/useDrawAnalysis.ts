import { useMemo } from 'react';
import type { DrawData } from '@/entities/drawing';
import {
  ACHIEVEMENT_CONFIG,
  type AchievementID,
} from '@/features/game-round-summary/utils/achievementConfig';

export const useDrawAnalysis = (drawData: DrawData, score: number) => {
  // 가장 많이 사용한 3가지 색상
  const topColors = useMemo(() => {
    const colorMap: Record<string, number> = {};
    drawData.lines.forEach((line) => {
      if (line.tool === 'eraser') return;
      colorMap[line.color] = (colorMap[line.color] || 0) + line.points.length;
    });
    return Object.entries(colorMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color);
  }, [drawData]);

  // 그림 별점
  const starDisplay = useMemo(
    () => ({
      displayScore: score,
      stars: Array.from({ length: 5 }, (_, i) => {
        const scoreForFull = (i + 1) * 2;
        const scoreForHalf = i * 2 + 1;
        if (score >= scoreForFull) return 'full';
        if (score >= scoreForHalf) return 'half';
        return 'empty';
      }),
    }),
    [score],
  );

  // 피지컬 통계 (이동거리 & 획수)
  const stats = useMemo(() => {
    let totalDistance = 0;

    drawData.lines.forEach((line) => {
      for (let i = 0; i < line.points.length; i += 2) {
        if (i >= 2) {
          const x = line.points[i];
          const y = line.points[i + 1];
          const prevX = line.points[i - 2];
          const prevY = line.points[i - 1];
          // 유클리드 거리 계산
          totalDistance += Math.sqrt(
            Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2),
          );
        }
      }
    });

    return {
      strokeCount: drawData.lines.length,
      distanceMeter: 12.5,
      colorCount: 5,
    };
  }, [drawData]);

  // TODO: 도전과제(업적)
  const achievement = useMemo(() => {
    let selectedId: AchievementID = 'DEFAULT';

    if (stats.colorCount >= 5) {
      selectedId = 'COLOR_MASTER';
    } else if (stats.strokeCount > 100) {
      selectedId = 'EFFORT_KING';
    } else if (stats.strokeCount < 10 && stats.strokeCount > 0) {
      selectedId = 'MINIMALIST';
    }

    return ACHIEVEMENT_CONFIG[selectedId];
  }, [stats]);

  return { topColors, starDisplay, stats, achievement };
};
