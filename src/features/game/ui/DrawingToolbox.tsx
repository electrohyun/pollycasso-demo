import {
  PaintBrushIcon,
  PencilIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid';

import { DRAWING_COLORS } from '@/features/drawing';

export const DrawingToolbox = () => {
  return (
    <div className="flex items-center w-[800px] h-[90px] px-6 py-5 bg-gradient-to-r rounded-3xl shadow-inner from-[#909090] to-[#D4D4D4] gap-x-4 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]">
      <div className="flex flex-none gap-x-3">
        <div className="w-14 h-14 bg-white rounded-xl flex justify-center items-center cursor-pointer hover:bg-gray-100 shadow-sm">
          <PencilIcon className="w-6 h-6 text-gray-700" />
        </div>

        <div className="w-14 h-14 bg-white rounded-xl flex justify-center items-center cursor-pointer hover:bg-gray-100 shadow-sm">
          <PaintBrushIcon className="w-6 h-6 text-gray-700" />
        </div>

        <div className="w-14 h-14 bg-white rounded-xl flex justify-center items-center cursor-pointer hover:bg-gray-100 shadow-sm">
          <PencilSquareIcon className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      <div className="flex flex-col justify-between w-[175px] h-full">
        <div className="flex justify-between items-center px-2">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm">
            <div className="w-1.5 h-1.5 bg-[#F08080] rounded-full" />
          </div>
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm">
            <div className="w-2.5 h-2.5 bg-[#F08080] rounded-full" />
          </div>
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm">
            <div className="w-3.5 h-3.5 bg-[#F08080] rounded-full" />
          </div>
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm">
            <div className="w-[14px] h-[14px] bg-[#F08080] rounded-full" />
          </div>
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm">
            <div className="w-[18px] h-[18px] bg-[#F08080] rounded-full" />
          </div>
        </div>

        <div className="w-full h-[22px] bg-white rounded-lg flex items-center px-2 shadow-sm cursor-pointer">
          <div className="w-full h-[6px] bg-[#F08080] rounded-full opacity-90" />
        </div>
      </div>

      <div className="w-[150px] h-full bg-white rounded-2xl font-bold text-gray-400 flex justify-center items-center cursor-pointer shadow-sm hover:text-gray-800 hover:bg-gray-50">
        ERASE
      </div>

      <div className="flex-1 h-full bg-white rounded-2xl flex justify-center items-center px-4 shadow-sm">
        <div className="grid grid-cols-7 gap-x-2 gap-y-2">
          {DRAWING_COLORS.map((color) => (
            <button
              key={color}
              className="w-4 h-4 rounded-full transition-transform hover:scale-110 focus:outline-none"
              style={{
                backgroundColor: color,
                border: color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none',
              }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
