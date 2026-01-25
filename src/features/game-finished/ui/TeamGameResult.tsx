import { StarIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';

import { BluePodium, GoldMedal, RedPodium, SoloPodium } from '@/assets';
import type { TeamScore } from '@/shared/model';

import { BACKGROUND_FIREWORKS, FOREGROUND_FIREWORKS } from '../model/fireworks';
import type { FinishedPlayer } from '../model/types';
import { FireworksLayer } from './FireworksLayer';
import { RankRow } from './RankRow';
import { TeamPodiumSpot } from './TeamPodiumSpot';

interface TeamGameResultProps {
  results: FinishedPlayer[];
  teamScore: TeamScore | null;
}

export const TeamGameResult = ({ results, teamScore }: TeamGameResultProps) => {
  const winningTeamId = useMemo(() => {
    if (!teamScore) return null;
    if (teamScore.red > teamScore.blue) return 'RED';
    if (teamScore.blue > teamScore.red) return 'BLUE';
    return 'DRAW';
  }, [teamScore]);

  const { podiumMembers, listMembers } = useMemo(() => {
    if (!winningTeamId || winningTeamId === 'DRAW') {
      return {
        podiumMembers: results.filter((r) => r.rank <= 3),
        listMembers: results.filter((r) => r.rank > 3),
      };
    }

    const winners = results
      .filter((r) => r.teamId === winningTeamId)
      .sort((a, b) => b.totalScore - a.totalScore);

    const losers = results.filter((r) => r.teamId !== winningTeamId);

    return { podiumMembers: winners, listMembers: losers };
  }, [results, winningTeamId]);

  const firstPlace = podiumMembers[0];
  const secondPlace = podiumMembers[1];
  const thirdPlace = podiumMembers[2];

  const getTeamTotalScore = (teamId: string) => {
    return results
      .filter((member) => member.teamId === teamId)
      .reduce((sum, member) => sum + member.totalScore, 0);
  };

  const redTeamScore = getTeamTotalScore('RED');
  const blueTeamScore = getTeamTotalScore('BLUE');

  const winningScore = useMemo(() => {
    if (!teamScore) return 0;
    return teamScore.red >= teamScore.blue ? redTeamScore : blueTeamScore;
  }, [teamScore, redTeamScore, blueTeamScore]);

  const PodiumSrc = useMemo(() => {
    if (!teamScore) return SoloPodium;
    if (teamScore.red > teamScore.blue) return RedPodium;
    if (teamScore.blue > teamScore.red) return BluePodium;
    return SoloPodium;
  }, [teamScore]);

  return (
    <div className="relative w-[1000px] mt-20">
      <FireworksLayer items={BACKGROUND_FIREWORKS} />
      <img
        src={PodiumSrc}
        alt="Game Finished Podium"
        className="w-full object-contain drop-shadow-2xl"
      />

      <span className="absolute top-7 left-1/2 -translate-x-1/2 text-3xl text-white font-ssrm font-bold drop-shadow-lg">
        {winningTeamId === 'RED'
          ? 'RED TEAM WIN'
          : winningTeamId === 'BLUE'
            ? 'BLUE TEAM WIN'
            : 'DRAW'}
      </span>

      <div className="absolute -top-[410px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <StarIcon className="w-6 h-6 text-[#E1D1AE] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
          <span className="font-ssrm font-black text-xl text-[#E1D1AE] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pt-2">
            {(winningScore / 100).toFixed(1)}
          </span>
        </div>
      </div>

      <img
        src={GoldMedal}
        alt="Gold Medal"
        className="absolute -top-[370px] left-1/2 -translate-x-1/2 w-28 h-28 object-contain drop-shadow-lg z-50"
      />

      {firstPlace && (
        <TeamPodiumSpot
          rank={1}
          nickname={firstPlace.nickname}
          coins={firstPlace.coinsGained}
          xp={firstPlace.expGained}
          teamId={firstPlace.teamId}
        />
      )}

      {secondPlace && (
        <TeamPodiumSpot
          rank={2}
          nickname={secondPlace.nickname}
          coins={secondPlace.coinsGained}
          xp={secondPlace.expGained}
          teamId={secondPlace.teamId}
        />
      )}

      {thirdPlace && (
        <TeamPodiumSpot
          rank={3}
          nickname={thirdPlace.nickname}
          coins={thirdPlace.coinsGained}
          xp={thirdPlace.expGained}
          teamId={thirdPlace.teamId}
        />
      )}

      {listMembers.map((member, index) => {
        const topPosition = 140 + index * 150;

        return (
          <RankRow
            key={member.userId}
            rank={member.rank}
            rankText="LOSE"
            nickname={member.nickname}
            coins={member.coinsGained}
            xp={member.expGained}
            score={member.totalScore}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${topPosition}%` }}
            teamId={member.teamId}
          />
        );
      })}

      <FireworksLayer items={FOREGROUND_FIREWORKS} />
    </div>
  );
};
