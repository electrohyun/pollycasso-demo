import { useState } from 'react';

import { DRAWING_CONSTANTS } from '@/features/drawing';
import { BrushSizeSlider } from './BrushSizeSlider';
import { ColorPalette } from './ColorPalette';
import { ToolSelector } from './ToolSelector';

type DrawingTool = 'pen' | 'brush' | 'marker' | 'eraser';

const ACTIVE_COLOR = '#13E000';

export const DrawingToolbox = () => {
  const [activeTool, setActiveTool] = useState<DrawingTool>(
    DRAWING_CONSTANTS.DEFAULT_TOOL,
  );
  const [strokeWidth, setStrokeWidth] = useState<number>(
    DRAWING_CONSTANTS.DEFAULT_SIZE,
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    DRAWING_CONSTANTS.DEFAULT_COLOR,
  );

  return (
    <div className="flex items-center w-[850px] h-[90px] px-8 py-5 bg-gradient-to-r rounded-3xl from-[#909090] to-[#D4D4D4] gap-x-4 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]">
      <ToolSelector
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        activeColor={ACTIVE_COLOR}
      />

      <BrushSizeSlider
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        selectedColor={selectedColor}
        activeColor={ACTIVE_COLOR}
      />

      <button
        onClick={() => setActiveTool('eraser')}
        className="w-[150px] h-full bg-white rounded-2xl text-xl font-bold flex justify-center items-center cursor-pointer shadow-sm hover:bg-gray-50 transition-all"
        style={{
          color: '#909090',
          boxShadow:
            activeTool === 'eraser' ? `0 0 0 3px ${ACTIVE_COLOR}` : 'none',
        }}
      >
        ERASE
      </button>

      <div className="flex-1 h-full bg-white rounded-2xl flex justify-center items-center px-4 shadow-sm">
        <ColorPalette
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          activeColor={ACTIVE_COLOR}
        />
      </div>
    </div>
  );
};
