import { StarIcon } from '@heroicons/react/24/solid';

import {
  Bird,
  Coin,
  GoldBelt,
  SilverBelt,
  BronzeBelt,
  LaurelWreath,
} from '@/assets';
import { RANK_STYLES } from '../constants/styles';
import { getLevelStyles } from '../utils/levelUtils';

const BELT_IMAGES = {
  1: GoldBelt,
  2: SilverBelt,
  3: BronzeBelt,
};

interface PodiumSpotProps {
  rank: 1 | 2 | 3;
  nickname: string;
  coins: number;
  xp: number;
  score: number;
  level: number;
}

export const PodiumSpot = ({
  rank,
  nickname,
  coins,
  xp,
  score,
  level,
}: PodiumSpotProps) => {
  const styles = RANK_STYLES[rank];
  const beltImg = BELT_IMAGES[rank];

  const levelColors = getLevelStyles(level);

  return (
    <div className={styles.wrapper}>
      <img src={Bird} className={styles.bird} alt="bird" />

      <img src={beltImg} className={styles.belt} alt="belt" />

      {rank === 1 && styles.wreath && (
        <img src={LaurelWreath} className={styles.wreath} alt="wreath" />
      )}

      <div className={styles.starWrapper}>
        <StarIcon className={`${styles.starIcon} ${levelColors.star}`} />
        <span className={`${styles.scoreText} ${levelColors.star}`}>
          {score}
        </span>
      </div>

      <span className={`${styles.badge} ${levelColors.badge}`}>{nickname}</span>

      <img src={Coin} className={styles.coinIcon} alt="coin" />

      <span className={styles.rewardText}>
        {coins}Coin +<span className={styles.rewardSpan}> {xp}xp</span>
      </span>
    </div>
  );
};
