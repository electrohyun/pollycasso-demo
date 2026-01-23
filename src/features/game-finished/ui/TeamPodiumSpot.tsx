import { Bird, Coin, LaurelWreath } from '@/assets';

interface PodiumSpotProps {
  rank: 1 | 2 | 3;
  nickname: string;
  coins: number;
  xp: number;
  teamId: string | null;
}

export const TeamPodiumSpot = ({
  rank,
  nickname,
  coins,
  xp,
  teamId,
}: PodiumSpotProps) => {
  const badgeBgClass = teamId === 'BLUE' ? 'bg-[#64ACFF]' : 'bg-[#FB6464]';

  if (rank === 1) {
    return (
      <div className="absolute bottom-[80%] left-1/2 -translate-x-1/2 w-[275px] h-[275px] bg-transparent">
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-b to-transparent z-0 pointer-events-none blur-sm w-[300px] h-[660px] -top-[350px] from-white/80 via-white/50"
          style={{ clipPath: 'polygon(50% 0%, 50% 0%, 100% 100%, 0% 100%)' }}
        />

        <img src={Bird} className="relative w-full h-full" alt="bird" />

        <img
          src={LaurelWreath}
          className="absolute -top-5 left-[50%] -translate-x-1/2 w-[120px] h-[120px] object-contain"
          alt="wreath"
        />

        <span
          className={`absolute top-12 left-[510px] font-ssrm font-bold text-white text-2xl ${badgeBgClass} px-4 py-1 rounded-[20px] whitespace-nowrap shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]`}
        >
          {nickname}
        </span>

        <div className="absolute top-[94px] left-[530px] flex items-center justify-end gap-2">
          <img src={Coin} className="w-5 h-5 object-contain" alt="coin" />
          <span className="font-ssrm font-bold text-white text-xl drop-shadow-sm">
            {coins}Coin+{xp}xp
          </span>
        </div>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="absolute bottom-[80%] left-[30%] -translate-x-1/2 w-[275px] h-[275px] bg-transparent">
        <img src={Bird} className="w-full h-full object-contain" alt="bird" />

        <img
          src={LaurelWreath}
          className="absolute -top-5 left-[50%] -translate-x-1/2 w-[120px] h-[120px] object-contain"
          alt="wreath"
        />

        <span
          className={`absolute top-32 left-[710px] font-ssrm font-bold text-white text-2xl ${badgeBgClass} px-4 py-1 rounded-[20px] whitespace-nowrap shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]`}
        >
          {nickname}
        </span>

        <div className="absolute top-[174px] left-[730px] flex items-center justify-end gap-2">
          <img src={Coin} className="w-5 h-5 object-contain" alt="coin" />
          <span className="font-ssrm font-bold text-white text-xl drop-shadow-sm">
            {coins}Coin+{xp}xp
          </span>
        </div>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="absolute bottom-[80%] right-[30%] translate-x-1/2 w-[275px] h-[275px] bg-transparent">
        <img src={Bird} className="w-full h-full object-contain" alt="bird" />

        <img
          src={LaurelWreath}
          className="absolute -top-5 left-[50%] -translate-x-1/2 w-[120px] h-[120px] object-contain"
          alt="wreath"
        />

        <span
          className={`absolute top-52 left-[310px] font-ssrm font-bold text-white text-2xl ${badgeBgClass} px-4 py-1 rounded-[20px] whitespace-nowrap shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]`}
        >
          {nickname}
        </span>

        <div className="absolute top-[252px] left-[330px] flex items-center justify-end gap-2">
          <img src={Coin} className="w-5 h-5 object-contain" alt="coin" />
          <span className="font-ssrm font-bold text-white text-xl drop-shadow-sm">
            {coins}Coin+{xp}xp
          </span>
        </div>
      </div>
    );
  }

  return null;
};
