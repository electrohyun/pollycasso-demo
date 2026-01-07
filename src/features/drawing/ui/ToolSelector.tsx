import { PaintBrushIcon, PencilIcon } from '@heroicons/react/24/solid';

import { Pen } from '@/assets';
import { DRAWING_TOOLS } from '@/features/drawing/constants/drawingConstants';

const TOOL_ICONS = {
  PencilIcon: (props: any) => <PencilIcon {...props} />,
  PaintBrushIcon: (props: any) => <PaintBrushIcon {...props} />,
  MarkerIcon: ({ className }: { className?: string }) => (
    <img src={Pen} alt="Marker" className={`${className} grayscale`} />
  ),
};

interface ToolSelectorProps {
  activeTool: string;
  onSelectTool: (toolId: any) => void;
  activeColor: string;
}

export const ToolSelector = ({
  activeTool,
  onSelectTool,
  activeColor,
}: ToolSelectorProps) => {
  return (
    <div className="flex flex-none gap-x-3">
      {DRAWING_TOOLS.map((tool) => {
        const isActive = activeTool === tool.id;
        const IconComponent = TOOL_ICONS[tool.Icon as keyof typeof TOOL_ICONS];

        return (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="w-14 h-14 bg-white rounded-xl flex justify-center items-center cursor-pointer hover:bg-gray-100 shadow-sm transition-all"
            style={{
              boxShadow: isActive ? `0 0 0 3px ${activeColor}` : 'none',
            }}
            aria-label={`Select ${tool.id}`}
          >
            <IconComponent className="w-8 h-8 text-[#909090]" />
          </button>
        );
      })}
    </div>
  );
};
