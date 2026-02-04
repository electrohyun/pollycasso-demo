import { ProfileInput } from './ProfileInput';
import type { User } from '@/entities/user';

interface ProfileSectionProps {
  user: User;
}

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  return (
    <form className="relative grid grid-cols-2 grid-rows-2 w-full h-[520px] gap-x-10 gap-y-2">
      <div className="flex flex-col">
        <div className="h-14 mb-2 flex items-center">
          <span className="text-4xl ml-2 font-light">닉네임 변경</span>
        </div>
        <ProfileInput
          placeholder="닉네임"
          defaultValue={user.nickname}
          isValid={true}
        />
        <span className="text-green-400 text-sm ml-4 my-4 font-pretendard h-4">
          - 사용 가능한 닉네임입니다.
        </span>
      </div>

      <div className="flex flex-col pl-6">
        <div className="h-14 mb-2 flex items-center">
          <span className="text-4xl ml-2 font-light">태그 변경</span>
        </div>
        <ProfileInput
          placeholder="태그"
          defaultValue={user.tag}
          isValid={true}
        />
        <span className="text-green-400 text-sm ml-4 my-4 font-pretendard h-4">
          - 사용 가능한 태그입니다.
        </span>
      </div>

      <div className="flex flex-col">
        <div className="h-14 mb-4 flex items-center">
          <span className="text-4xl ml-2 font-light">비밀번호 변경</span>
        </div>

        <div className="flex flex-col">
          <ProfileInput
            type="password"
            placeholder="현재 비밀번호"
            isValid={false}
          />
          <span className="text-green-400 text-sm ml-4 my-4 font-pretendard h-4">
            - 비밀번호가 확인되었습니다.
          </span>

          <ProfileInput
            type="password"
            placeholder="새 비밀번호"
            isValid={false}
          />
          <span className="text-green-400 text-sm ml-4 my-4 font-pretendard h-4">
            - 8자 이상, 영문/숫자를 포함해주세요.
          </span>
        </div>
      </div>

      <div className="absolute -bottom-20 right-10">
        <button
          type="button"
          className="w-[160px] h-[70px] bg-transparent border-2 border-white text-white text-3xl rounded-full hover:border-green-400 hover:text-green-400 transition-all shadow-lg font-bold"
        >
          저장
        </button>
      </div>
    </form>
  );
};
