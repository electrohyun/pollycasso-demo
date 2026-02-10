import { useSoundStore } from '@/entities/sound';
import { SoundManager } from '@/shared/api/sound/manager';
import { RangeSlider } from './RangeSlider';
import { useState } from 'react';
import { SOUND_ASSETS } from '@/shared/api/sound/assets';

export const SettingsSection = () => {
  const { bgmVolume, sfxVolume, setBgmVolume, setSfxVolume } = useSoundStore();

  const [leafCount, setLeafCount] = useState(
    () => Number(localStorage.getItem('leafCount')) || 8,
  );

  const handleSaveSettings = () => {
    localStorage.setItem('leafCount', String(leafCount));
    alert('환경설정이 저장되었습니다!');
  };

  return (
    <div className="relative w-full h-[520px] pt-4 flex flex-col gap-14">
      <RangeSlider
        label="배경음악 크기 (Background Music)"
        value={Math.round(bgmVolume * 100)}
        min={0}
        max={100}
        unit="%"
        onChange={(e) => {
          const val = Number(e.target.value) / 100;
          setBgmVolume(val);
          SoundManager.setBgmVolume(val);
        }}
      />

      <RangeSlider
        label="효과음 크기 (Sounds Effect)"
        value={Math.round(sfxVolume * 100)}
        min={0}
        max={100}
        unit="%"
        onChange={(e) => {
          const val = Number(e.target.value) / 100;
          setSfxVolume(val);
          SoundManager.playSfx(SOUND_ASSETS.SFX.ROUND_SUMMARY, val);
        }}
      />

      <RangeSlider
        label="나뭇잎 개수 (Background Leaf)"
        value={leafCount}
        min={0}
        max={20}
        unit="개"
        maxLabel="20"
        description="* 개수를 줄이면 성능이 향상됩니다."
        onChange={(e) => setLeafCount(Number(e.target.value))}
      />

      <div className="absolute -bottom-20 right-10">
        <button
          type="button"
          onClick={handleSaveSettings}
          className="w-[160px] h-[70px] bg-transparent border-2 border-white text-white text-3xl rounded-full hover:border-green-400 hover:text-green-400 transition-all shadow-lg font-bold"
        >
          적용
        </button>
      </div>
    </div>
  );
};
