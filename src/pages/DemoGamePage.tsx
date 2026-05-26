import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import GameWidget from '@/widgets/game/ui/GameWidget';
import type {
  PhaseContext,
  Player,
  RoomState,
  RoomStatus,
} from '@/shared/model';
import { usePortfolioOutfitForPlayer } from '@/features/shop/model/portfolioShopStorage';

type DemoPhase = Extract<
  RoomStatus,
  'THEME_SELECTING' | 'DRAWING' | 'EVALUATING' | 'ROUND_SUMMARY' | 'FINISHED'
>;

const phaseMeta: { key: DemoPhase; label: string; help: string }[] = [
  {
    key: 'THEME_SELECTING',
    label: '주제 선정',
    help: '방장이 이번 라운드 주제를 입력하고 확정하는 단계입니다.',
  },
  {
    key: 'DRAWING',
    label: '그리기',
    help: '정해진 주제에 맞춰 기존 캔버스와 도구로 그림을 그리는 단계입니다.',
  },
  {
    key: 'EVALUATING',
    label: '평가',
    help: '다른 플레이어의 그림을 넘겨 보면서 점수를 주는 단계입니다.',
  },
  {
    key: 'ROUND_SUMMARY',
    label: '라운드 결산',
    help: '이번 라운드 순위, 점수, 그림 분석을 확인하는 단계입니다.',
  },
  {
    key: 'FINISHED',
    label: '게임 결산',
    help: '최종 결과와 보상을 확인하는 단계입니다.',
  },
];

const getPhaseContext = (phase: DemoPhase): PhaseContext => {
  if (phase === 'THEME_SELECTING') {
    return {
      kind: 'THEME_SELECTING',
      selectorId: 1,
      nickname: '폴리',
    };
  }

  if (phase === 'DRAWING') {
    return {
      kind: 'DRAWING',
      currentTheme: '겨울 데이트룩',
    };
  }

  if (phase === 'EVALUATING') {
    return {
      kind: 'EVALUATING',
      drawings: {},
    };
  }

  if (phase === 'ROUND_SUMMARY') {
    return {
      kind: 'ROUND_SUMMARY',
      ranking: [],
    };
  }

  return {
    kind: 'FINISHED',
    results: [],
  };
};

const DemoPhaseGuide = ({
  activePhase,
  onPhaseChange,
}: {
  activePhase: DemoPhase;
  onPhaseChange: (phase: DemoPhase) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const current = phaseMeta.find((phase) => phase.key === activePhase);

  return (
    <div className="fixed bottom-6 left-6 z-[10000] font-ssrm font-bold text-white">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-2xl bg-[#1E3411]/95 px-5 py-3 text-xl shadow-2xl transition hover:bg-[#2D4A1B]"
        >
          페이즈 열기
        </button>
      ) : (
        <div className="w-[360px] rounded-3xl bg-[#1E3411]/95 p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/60">현재 페이즈</p>
              <h2 className="text-2xl">{current?.label}</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl bg-white/15 px-4 py-2 text-lg transition hover:bg-white/25"
            >
              접기
            </button>
          </div>

          <p className="mb-4 rounded-2xl bg-black/20 px-4 py-3 text-base leading-snug text-white/85">
            {current?.help}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {phaseMeta.map((phase) => (
              <button
                key={phase.key}
                onClick={() => onPhaseChange(phase.key)}
                className={`h-11 rounded-xl px-3 text-base transition ${
                  activePhase === phase.key
                    ? 'bg-[#EF5F52] text-white'
                    : 'bg-white text-[#1E3411] hover:bg-[#EAF7E8]'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DemoGamePage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<DemoPhase>('THEME_SELECTING');
  const portfolioOutfit = usePortfolioOutfitForPlayer('bird_07');

  const demoPlayers = useMemo<Player[]>(
    () => [
      {
        userId: '1',
        nickname: '폴리',
        level: 7,
        exp: 0,
        coins: 99,
        outfit: portfolioOutfit,
        inventory: [
          { itemId: 'blur', count: 1, cooldownEndsAt: 0 },
          { itemId: 'ink_splash', count: 2, cooldownEndsAt: 0 },
          { itemId: 'bomb', count: 1, cooldownEndsAt: 0 },
        ],
        status: 'IDLE',
        isConnected: true,
        isReady: false,
        teamId: 'BLUE',
        totalScore: 920,
      },
      {
        userId: '2',
        nickname: '그림고수',
        level: 12,
        exp: 400,
        coins: 100,
        outfit: {
          bird: 'bird_03',
          hat: 'hat_12',
          accessory: 'acc_17',
          top: 'top_16',
          bottom: null,
          shoes: 'shoes_11',
          effect: null,
        },
        inventory: [],
        status: 'IDLE',
        isConnected: true,
        isReady: true,
        teamId: 'RED',
        totalScore: 850,
      },
      {
        userId: '3',
        nickname: '색칠장인',
        level: 9,
        exp: 230,
        coins: 60,
        outfit: {
          bird: 'bird_04',
          hat: 'hat_10',
          accessory: null,
          top: 'top_19',
          bottom: null,
          shoes: 'shoes_09',
          effect: 'effect_02',
        },
        inventory: [],
        status: 'IDLE',
        isConnected: true,
        isReady: true,
        teamId: 'BLUE',
        totalScore: 780,
      },
    ],
    [portfolioOutfit],
  );

  const demoRoomState = useMemo<RoomState>(() => {
    const endsAt = phase === 'FINISHED' ? null : Date.now() + 1000 * 90;

    return {
      status: phase,
      hostId: '1',
      endsAt,
      currentRound: 1,
      totalRounds: 3,
      settings: {
        roomTitle: '당신이 방장!',
        gameMode: 'SOLO',
        maxPlayers: 6,
        isPrivate: false,
      },
      players: demoPlayers,
      phaseContext: getPhaseContext(phase),
      teamScore: null,
    };
  }, [phase, demoPlayers]);

  return (
    <>
      <GameWidget
        phase={demoRoomState.status}
        endsAt={demoRoomState.endsAt}
        phaseContext={demoRoomState.phaseContext}
        playerMap={{ '1': 1, '2': 2, '3': 3 }}
        overrideState={demoRoomState}
      />

      <DemoPhaseGuide activePhase={phase} onPhaseChange={setPhase} />

      {phase === 'FINISHED' && (
        <button
          onClick={() => navigate('/')}
          className="fixed bottom-6 right-6 z-[10000] rounded-2xl bg-[#EF5F52] px-8 py-3 font-ssrm text-2xl font-bold text-white shadow-xl"
        >
          방 나가기
        </button>
      )}
    </>
  );
};

export default DemoGamePage;
