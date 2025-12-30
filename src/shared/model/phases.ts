import type { DrawData } from './drawing';

export interface ThemeSelectingContext {
  selectorId: string;
  nickname: string;
  value: string;
}

export interface DrawingContext {
  currentTheme: string;
}

export interface EvaluatingContext {
  drawings: Record<string, DrawData>;
}

export interface RoundSummaryContext {
  ranking: RoundResult[];
}

export interface RoundResult {
  userId: string;
  drawData: DrawData;
  score: number;
  isMine: boolean;
}

export interface FinishContext {
  results: {
    userId: string;
    rank: number;
    expGained: number;
    coinsGained: number;
    didLevelUp: boolean;
  }[];
}
