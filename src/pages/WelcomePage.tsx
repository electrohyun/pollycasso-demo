import { useNavigate } from 'react-router';

const WelcomePage = () => {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        onClick={goToLoginPage}
        className="w-[300px] h-[300px] bg-white rounded-full shadow-md"
      />

      <div className="mt-10 text-center">
        <span className="mt-6 text-4xl text-green-500">밥아저씨</span>
        <span className="text-4xl">
          님<br />
        </span>
        <span className="text-4xl">안녕하세요!</span>
      </div>
    </div>
  );
};

export default WelcomePage;
