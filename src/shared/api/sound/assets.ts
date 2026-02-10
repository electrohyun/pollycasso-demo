import { Click, RoundSummary } from '@/assets/sounds';

export const SOUND_ASSETS = {
  BGM: {
    LOBBY: `${import.meta.env.VITE_ASSET_CDN_URL}/bg_lobby.mp3`,
    GAME: `${import.meta.env.VITE_ASSET_CDN_URL}/bg_game.mp3`,
  },
  SFX: {
    CLICK: Click,
    ROUND_SUMMARY: RoundSummary,
  },
};
