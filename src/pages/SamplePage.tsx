import Spinner from '@/shared/ui/Spinner';
import clsx from 'clsx';

const SamplePage = () => {
  return (
    <div className={clsx('m-4')}>
      <p>폴리카소 그리고 모던애자일 화이팅!</p>
      <p>예쁜 스피너도 있읍니다</p>
      <p>로그인 버튼도 테스트 해보세요(/login)</p>
      <Spinner message="폴리가 물감 쏟는 중..." />
    </div>
  );
};

export default SamplePage;
