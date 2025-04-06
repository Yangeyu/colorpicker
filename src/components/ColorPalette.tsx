import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';

interface ColorPaletteProps {
  colors: string[];
}

const ColorPalette = ({ colors }: ColorPaletteProps) => {
  const [customColor, setCustomColor] = useState<string>('#8cb368');
  
  const handleCopy = (color: string) => {
    toast.success(`已复制: ${color}`);
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };
  
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-wrap gap-5 max-w-full">
        {colors.map((color, index) => (
          <div 
            key={`${color}-${index}`}
            className="flex-shrink-0"
          >
            <CopyToClipboard
              text={color}
              onCopy={() => handleCopy(color)}
            >
              <div 
                className="w-16 h-16 rounded-lg cursor-pointer relative hover:scale-105 transition-transform shadow-lg"
                style={{ 
                  backgroundColor: color,
                  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
                }}
                title={`点击复制: ${color}`}
              />
            </CopyToClipboard>
            <span className="mt-2 font-mono text-xs text-center block truncate w-16 text-gray-300">
              {color}
            </span>
          </div>
        ))}
        
        {/* 颜色吸取器 */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg" style={{ 
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
          }}>
            <input
              type="color"
              value={customColor}
              onChange={handleColorChange}
              className="absolute left-0 top-0 w-20 h-20 cursor-pointer opacity-0"
              aria-label="选择自定义颜色"
            />
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: customColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={isLightColor(customColor) ? '#000' : '#fff'}>
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L6 9.657v4.586h4.243z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <CopyToClipboard
            text={customColor}
            onCopy={() => handleCopy(customColor)}
          >
            <div
              className="mt-2 w-16 text-center truncate font-mono text-xs cursor-pointer text-gray-300"
              title={`点击复制: ${customColor}`}
            >
              {customColor}
            </div>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

// 判断颜色是否为亮色，用于决定文字/图标颜色
function isLightColor(color: string): boolean {
  // 移除#并转换为RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // 计算亮度 (HSP色彩模型)
  const hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  
  // 亮度大于127.5认为是亮色
  return hsp > 127.5;
}

export default ColorPalette; 