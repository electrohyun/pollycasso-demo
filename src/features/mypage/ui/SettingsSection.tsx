import { useState } from 'react';
import { RangeSlider } from './RangeSlider';

export const SettingsSection = () => {
  const [bgmVolume, setBgmVolume] = useState(
    () => Number(localStorage.getItem('bgmVolume')) || 50,
  );
  const [sfxVolume, setSfxVolume] = useState(
    () => Number(localStorage.getItem('sfxVolume')) || 80,
  );
  const [leafCount, setLeafCount] = useState(
    () => Number(localStorage.getItem('leafCount')) || 8,
  );

  const handleSaveSettings = () => {
    localStorage.setItem('bgmVolume', String(bgmVolume));
    localStorage.setItem('sfxVolume', String(sfxVolume));
    localStorage.setItem('leafCount', String(leafCount));
    alert('환경설정이 저장되었습니다!');
  };

  return (
    <div className="relative w-full h-[520px] pt-4 flex flex-col gap-14">
      <RangeSlider
        label="배경음악 크기 (Background Music)"
        value={bgmVolume}
        min={0}
        max={100}
        unit="%"
        onChange={(e) => setBgmVolume(Number(e.target.value))}
      />

      <RangeSlider
        label="효과음 크기 (Sounds Effect)"
        value={sfxVolume}
        min={0}
        max={100}
        unit="%"
        onChange={(e) => setSfxVolume(Number(e.target.value))}
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
