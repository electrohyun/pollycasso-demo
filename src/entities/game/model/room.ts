import type {
  ThemeSelectingContext,
  DrawingContext,
  EvaluatingContext,
  RoundSummaryContext,
  FinishContext,
} from './phases.ts';
import type { Player } from './player.ts';

export interface RoomState {
  status: RoomStatus;
  hostId: string;
  endsAt: number | null;

  settings: RoomSettings;
  players: Player[];
  currentRound: number | null;
  totalRounds: number | null;

  phaseContext:
    | ThemeSelectingContext
    | DrawingContext
    | EvaluatingContext
    | RoundSummaryContext
    | FinishContext
    | null;

  teamScore: {
    blue: number;
    red: number;
  } | null;
}

export type RoomStatus =
  | 'WAITING'
  | 'LOADING'
  | 'THEME_SELECTING'
  | 'DRAWING'
  | 'EVALUATING'
  | 'ROUND_SUMMARY'
  | 'FINISHED';

export interface RoomSettings {
  roomTitle: string;
  gameMode: GameMode;
  maxPlayers: number;
  isPrivate: boolean;
}

export type GameMode = 'SOLO' | 'TEAM';
