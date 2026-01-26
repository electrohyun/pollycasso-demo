import { Bird, Coin } from '@/assets';
import { MOCK_PRODUCTS } from '@/mocks/shop.mock';
import { cn } from '@/shared/lib';
import { useState } from 'react';

const ShopPage = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('인기순');

  const [cart, setCart] = useState<typeof MOCK_PRODUCTS>([]);

  const addToCart = (product: (typeof MOCK_PRODUCTS)[0]) => {
    const isExist = cart.some((item) => item.id === product.id);
    if (!isExist) {
      setCart((prev) => [...prev, product]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const sortOptions = ['인기순', '레벨순', '코인순'];

  const handleOptionClick = (option: string) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen gap-[24px] font-ssrm font-bold">
      <div className="flex flex-col justify-between w-[180px] h-[720px]">
        <div className="relative w-full z-50">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full h-[67.5px] bg-[#2a4718] hover:bg-[#1E3411] text-white text-[27px] rounded-[20px] hover:brightness-110 transition-all flex items-center justify-center"
          >
            {sortOption} ▽
          </button>

          {isSortOpen && (
            <div className="absolute top-[70px] left-0 w-full bg-[#FEFEFE] rounded-[20px] shadow-lg overflow-hidden flex flex-col py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    'w-full py-3 text-[20px] text-[#656565] hover:bg-gray-100 transition-colors',
                    sortOption === option &&
                      'text-black font-extrabold bg-gray-50',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full h-[630px] bg-[#1E3411]/40 rounded-[25px] overflow-hidden text-[31.5px]">
          {['기술', '새', '상의', '하의', '모자', '신발', '악세사리'].map(
            (item, index) => (
              <button
                key={item}
                className={cn(
                  'flex-1 text-white hover:bg-[#1E3411]/20 transition-colors hover:text-[#FFD966]',
                  index !== 0 && 'border-t border-[#1E3411]/20',
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="w-[900px] h-[720px] rounded-[30px] bg-[#1E3411]/40 shadow-inner p-8 pr-4">
        <div className="w-full h-full overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid grid-cols-3 gap-x-[20px] gap-y-[30px]">
            {MOCK_PRODUCTS.map((item) => {
              const isInCart = cart.some((cartItem) => cartItem.id === item.id);

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-between w-[260px] h-[350px] bg-white rounded-[20px] text-2xl font-bold text-gray-400 p-5"
                >
                  <div className="w-full h-[45px] flex gap-x-2">
                    <div className="w-[45px] h-[45px] bg-yellow-300 rounded-full shrink-0"></div>
                    <div className="flex flex-col justify-between flex-1 text-base overflow-hidden">
                      <span className="text-black">Lv.{item.level}</span>
                      <span className="text-[#535353] truncate">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <img
                    src={item.image}
                    className="flex-1 object-contain"
                    alt={item.name}
                  />
                  <div className="flex justify-between w-full h-[45px] rounded-lg overflow-hidden shrink-0">
                    <div className="flex items-center justify-center w-2/3 h-full bg-black">
                      <img src={Coin} className="w-5 h-5" alt="coin" />
                      <span className="text-white text-lg ml-2">
                        {item.price}coin
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={isInCart}
                      className={cn(
                        'flex justify-center items-center w-1/3 h-full text-base text-white',
                        isInCart
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#2CC724] hover:bg-[#2c9527]',
                      )}
                    >
                      {isInCart ? '완료' : '담기'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between w-[360px] h-[720px]">
        <div className="flex flex-col justify-between items-center w-[360px] h-[590px] bg-[#1E3411]/40 rounded-[30px] p-4">
          <div className="flex flex-col items-center w-[305px] h-[375px] bg-white rounded-3xl p-6">
            <div className="flex w-full h-[45px] gap-x-2">
              <div className="w-[45px] h-[45px] bg-yellow-300 rounded-full"></div>
              <div className="flex flex-col">
                <span className="text-black text-base">Lv.3</span>
                <span className="text-[#535353] text-lg">폴리칵소</span>
              </div>
            </div>
            <img
              src={Bird}
              className="flex-1 flex items-center justify-center my-2"
            ></img>
            <div className="absolute bottom-[450px] w-[180px] h-[40px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,transparent_70%)]" />
            <button className="flex items-center justify-center rounded-full text-xs px-3 py-1 bg-[#EF5F52] text-white ">
              Reset
            </button>
          </div>
          <div className="flex items-center w-1/2 h-[35px] bg-[#1E3411]/40 rounded-3xl">
            <img src={Coin} className="w-[40px] h-[40px]" />
            <div className="flex flex-1 justify-center items-center">
              <span className="text-white text-xl">120</span>
              <span className="text-white text-xl mx-1">/</span>
              <span className="text-[#FF7070] text-xl">240</span>
            </div>
          </div>
          <div className="relative w-[305px] h-[100px] bg-[#1E3411]/40 rounded-3xl">
            <span className="absolute -top-2 bg-[#81C27E] text-white text-base font-bold px-2 pt-[2px] pb-[2px] rounded-full">
              CART
            </span>
            <div className="w-full h-full overflow-y-auto px-2 pt-6 flex flex-col gap-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-start w-full h-[28px] shrink-0 rounded-lg pl-3 pr-1"
                >
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-4 h-4 bg-[#EB4D3D] rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-sm border-white border group"
                  >
                    <div className="w-2.5 h-[2px] bg-white group-active:scale-90" />
                  </button>
                  <span className="ml-2 text-white text-sm truncate font-medium max-w-[200px]">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="w-[360px] h-[105px] bg-gray-900 hover:bg-black text-white rounded-[30px] text-4xl">
          구매하기
        </button>
      </div>
    </div>
  );
};

export default ShopPage;
