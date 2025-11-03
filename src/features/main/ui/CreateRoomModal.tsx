import { XMarkIcon } from '@heroicons/react/24/solid';
import title from '@/assets/title.svg';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoomSchema } from '@/features/main/lib/validators';
import { z } from 'zod';
import { useNavigate } from 'react-router';

type CreateRoomForm = z.infer<typeof createRoomSchema>;

interface CreateRoomModalProps {
  onClose: () => void;
}

const basicTitles = [
  '미대생이 그려드립니다.',
  '밥아저씨 컴온!',
  '너만 오면 고고!',
  '숨 막히는 아트 배틀',
  '캔버스 파티',
];

const CreateRoomModal = ({ onClose }: CreateRoomModalProps) => {
  const navigate = useNavigate();
  const [roomTitle, setRoomTitle] = useState('');
  const [gameMode, setGameMode] = useState<'solo' | 'team' | null>(null);
  const [maxPlayers, setMaxPlayers] = useState(3);
  const [visibility, setVisibility] = useState<'public' | 'private' | null>(
    null,
  );
  const [password, setPassword] = useState('');

  // ✅ RHF shadow form
  const form = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      mode: undefined,
      maxPlayers: 3,
      isPrivate: false,
      password: '',
    },
  });

  // ✅ 랜덤 방 제목
  useEffect(() => {
    const randomTitle =
      basicTitles[Math.floor(Math.random() * basicTitles.length)];
    setRoomTitle(randomTitle);
    form.setValue('name', randomTitle);
  }, []);

  // 음… allowed players
  const allowedPlayers = gameMode === 'team' ? [4, 6] : [3, 4, 5, 6];
  const isMin = maxPlayers === allowedPlayers[0];
  const isMax = maxPlayers === allowedPlayers[allowedPlayers.length - 1];

  // UI sync → RHF sync
  const selectGameMode = (mode: 'solo' | 'team') => {
    setGameMode(mode);
    form.setValue('mode', mode.toUpperCase() as 'SOLO' | 'TEAM');
    form.trigger('mode');

    const newPlayers = mode === 'team' ? 4 : 3;
    setMaxPlayers(newPlayers);
    form.setValue('maxPlayers', newPlayers);
    form.trigger('maxPlayers');
  };

  const inc = () => {
    const idx = allowedPlayers.indexOf(maxPlayers);
    if (idx < allowedPlayers.length - 1) {
      const newVal = allowedPlayers[idx + 1];
      setMaxPlayers(newVal);
      form.setValue('maxPlayers', newVal);
      form.trigger('maxPlayers');
    }
  };

  const dec = () => {
    const idx = allowedPlayers.indexOf(maxPlayers);
    if (idx > 0) {
      const newVal = allowedPlayers[idx - 1];
      setMaxPlayers(newVal);
      form.setValue('maxPlayers', newVal);
      form.trigger('maxPlayers');
    }
  };

  const selectVisibility = (v: 'public' | 'private') => {
    setVisibility(v);
    const isPrivate = v === 'private';

    form.setValue('isPrivate', isPrivate);
    form.trigger('isPrivate');

    if (!isPrivate) {
      setPassword('');
      form.setValue('password', '');
      form.trigger('password');
    }
  };

  const onSubmit = () => {
    const data = form.getValues();
    console.log('✅ Final payload:', data);

    // TODO: socket.emit('room:create', data)
    onClose();
  };

  const canCreate =
    gameMode &&
    visibility &&
    (visibility === 'public' || password.length === 4) &&
    form.formState.isValid;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="relative bg-[#F2F2F2] w-[790px] p-6 rounded-2xl shadow-lg flex flex-col items-center">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-300 rounded-md p-1"
        >
          <XMarkIcon className="w-7 h-7 text-white" />
        </button>

        <img src={title} alt="Title" className="w-[450px] mt-6" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {/* 제목 */}
          <div className="flex mt-6">
            <span className="py-5 px-4 rounded-l-xl bg-[#419341] text-2xl text-white">
              제목
            </span>
            <div className="rounded-r-xl border border-[#419341] font-normal text-xl bg-white">
              <input
                {...form.register('name')}
                value={roomTitle}
                onChange={(e) => {
                  setRoomTitle(e.target.value);
                  form.setValue('name', e.target.value, {
                    shouldValidate: true,
                  });
                  form.trigger('name');
                }}
                placeholder="방 제목을 입력해주세요."
                className="w-[400px] px-5 py-5 rounded-r-xl focus:outline-none"
              />
            </div>
          </div>

          {form.formState.errors.name && (
            <p className="ml-[88px] mt-2 text-red-500 font-normal text-sm">
              - {form.formState.errors.name.message}
            </p>
          )}

          {/* 모드/인원/공개 */}
          <div className="grid grid-cols-3 gap-x-6 mt-6 text-center text-2xl">
            {/* 게임모드 */}
            <div className="flex flex-col items-center">
              <span className="bg-[#73ABFF] text-white font-bold rounded-t-xl px-6 py-3">
                게임모드
              </span>

              <div className="mt-3 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => selectGameMode('solo')}
                  className={`border-2 rounded-xl py-3 px-11 font-bold
                    ${
                      gameMode === 'solo'
                        ? 'border-[#74A9FF] text-[#3182F6] bg-white'
                        : 'border-transparent text-black bg-white/70'
                    }`}
                >
                  개인
                </button>
                <button
                  type="button"
                  onClick={() => selectGameMode('team')}
                  className={`border-2 rounded-xl py-3 px-11 font-bold
                    ${
                      gameMode === 'team'
                        ? 'border-[#74A9FF] text-[#3182F6] bg-white'
                        : 'border-transparent text-black bg-white/70'
                    }`}
                >
                  팀
                </button>
              </div>

              <div className="w-[130px] h-[10px] rounded-b-full bg-[#73ABFF] mt-2" />
            </div>

            {/* 인원 */}
            <div className="flex flex-col items-center">
              <span className="bg-[#FFBD2F] text-white font-bold rounded-t-xl px-6 py-3">
                게임인원
              </span>

              <div className="flex justify-center items-center mt-3 border-2 border-[#027DFF] bg-white rounded-xl font-bold text-[#027DFF] gap-2">
                <button
                  type="button"
                  disabled={isMin}
                  onClick={dec}
                  className={`pr-2 py-[50px] ${isMin ? 'opacity-0 cursor-default' : ''}`}
                >
                  <ChevronLeftIcon className="w-7 h-7 text-gray-500" />
                </button>

                <span className="text-2xl">{maxPlayers}인</span>

                <button
                  type="button"
                  disabled={isMax}
                  onClick={inc}
                  className={`pl-2 py-[50px] ${isMax ? 'opacity-0 cursor-default' : ''}`}
                >
                  <ChevronRightIcon className="w-7 h-7 text-gray-500" />
                </button>
              </div>

              <div className="w-[130px] h-[10px] rounded-b-full bg-[#FFBD2F] mt-2" />
            </div>

            {/* 공개/비공개 */}
            <div className="flex flex-col items-center">
              <span className="bg-[#6EE035] text-white font-bold rounded-t-xl px-6 py-3">
                공개설정
              </span>

              <div className="mt-3 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => selectVisibility('public')}
                  className={`border-2 rounded-xl py-3 px-11 font-bold
                    ${
                      visibility === 'public'
                        ? 'border-[#027DFF] text-[#027DFF] bg-white'
                        : 'border-transparent text-black bg-white/70'
                    }`}
                >
                  공개
                </button>
                <button
                  type="button"
                  onClick={() => selectVisibility('private')}
                  className={`border-2 rounded-xl py-3 px-8 font-bold
                    ${
                      visibility === 'private'
                        ? 'border-[#027DFF] text-[#027DFF] bg-white'
                        : 'border-transparent text-black bg-white/70'
                    }`}
                >
                  비공개
                </button>
              </div>

              <div className="w-[130px] h-[10px] rounded-b-full bg-[#6EE035] mt-2" />
            </div>
          </div>

          {/* 비밀번호 */}
          {visibility === 'private' && (
            <div className="flex mt-6">
              <span className="p-4 rounded-l-xl bg-[#027DFF] text-2xl text-white">
                비밀번호
              </span>
              <div className="rounded-r-xl border border-[#027DFF] font-normal bg-white">
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  placeholder="비밀번호를 입력해주세요. (4자리 숫자)"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      setPassword(val);
                      form.setValue('password', val);
                      form.trigger('password');
                    }
                  }}
                  className="text-normal w-[358px] px-5 py-5 rounded-r-xl focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 버튼 */}
          <button
            type="button"
            disabled={!canCreate}
            onClick={() => {
              if (!canCreate) return;
              const roomId = Math.floor(Math.random() * 9000) + 1000; // 가짜 roomId
              navigate(`/rooms/${roomId}`);
            }}
            className={`w-[480px] h-[80px] mt-8 text-white py-3 text-3xl rounded-xl
            ${canCreate ? 'bg-[#003D00] hover:bg-[#002E00]' : 'bg-[#7B9675] cursor-not-allowed'}`}
          >
            방만들기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
