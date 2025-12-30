import { useEffect, useMemo, useState } from 'react';

import {
  GameCanvas,
  GameHeader,
  GameSubmitButton,
  InventoryPanel,
  PHASE_TIME,
  PlayerSidebar,
} from '@/features/game';
import { ThemeSelector } from '@/features/game/ui/ThemeSelector';
import { useGameState } from '../model/useGameState';
import { useGameSubmission } from '../model/useGameSubmission';
import { useThemeSelecting } from '../model/useThemeSelecting';

const GameWidget = () => {
  const { status, players, endsAt, inventory, currentTheme } = useGameState();
  const { isMyTurn, selectingValue } = useThemeSelecting();
  const { completedCount, totalCount, isMeReady, toggleReady } =
    useGameSubmission();
  const [localInput, setLocalInput] = useState('');

  useEffect(() => {
    if (!isMyTurn) {
      setLocalInput(selectingValue);
    }
  }, [isMyTurn, selectingValue]);

  const totalTime = useMemo(() => {
    switch (status) {
      case 'THEME_SELECTING':
        return PHASE_TIME.THEME_SELECT;
      case 'DRAWING':
        return PHASE_TIME.DRAWING;
      case 'EVALUATING':
        return PHASE_TIME.EVALUATING;
      case 'ROUND_SUMMARY':
        return PHASE_TIME.ROUND_SUMMARY;
      case 'FINISHED':
        return PHASE_TIME.FINISHED;
      default:
        return 90;
    }
  }, [status]);

  return (
    <div className="w-full h-screen flex justify-between items-center font-ssrm px-20 py-4 overflow-hidden gap-16">
      <PlayerSidebar players={players} />

      <main className="w-full h-full rounded-3xl bg-white shadow-xl flex flex-col relative overflow-hidden">
        <GameHeader
          currentTheme={currentTheme}
          endsAt={endsAt}
          totalTime={totalTime}
        />

        <div className="flex-1 flex justify-center bg-white pt-52">
          {status === 'THEME_SELECTING' ? (
            <ThemeSelector
              isSelector={isMyTurn}
              inputValue={localInput}
              onChange={setLocalInput}
              onRandom={() => console.log('Random Theme!')}
            />
          ) : (
            <GameCanvas />
          )}
        </div>
      </main>

      <aside className="h-full flex flex-col justify-center gap-y-20">
        <InventoryPanel inventory={inventory} />

        <GameSubmitButton
          onComplete={toggleReady}
          completedCount={completedCount}
          totalCount={totalCount}
          isReady={isMeReady}
        />
      </aside>
    </div>
  );
};

export default GameWidget;
