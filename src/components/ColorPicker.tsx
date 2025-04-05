import { useState } from 'react';
import { copyToClipboard } from '../utils/colorUtils';

const ColorPicker = () => {
  const [pickedColor, setPickedColor] = useState<string>('#8cb368');
  const [copied, setCopied] = useState(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickedColor(e.target.value);
  };
  
  const handleCopyColor = async () => {
    try {
      await copyToClipboard(pickedColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('复制到剪贴板失败:', e);
    }
  };
  
  return (
    <div className="w-full overflow-hidden">
      <h2 className="text-xl font-bold mb-5" style={{ color: "var(--color-primary-dark)" }}>颜色选择器</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="color"
              value={pickedColor}
              onChange={handleColorChange}
              className="w-16 h-16 rounded-lg cursor-pointer"
              style={{ border: "1px solid var(--color-neutral-200)" }}
              aria-label="选择颜色"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm mb-1.5" style={{ color: "var(--color-neutral-600)" }}>选择一个颜色:</p>
            <div className="flex items-center gap-2">
              <p className="font-mono font-medium">{pickedColor.toUpperCase()}</p>
              <button
                onClick={handleCopyColor}
                className="ml-2 text-sm flex items-center gap-1 px-3 py-1 rounded-md"
                style={{ 
                  color: "var(--color-primary-dark)",
                  backgroundColor: copied ? "var(--color-primary-light)" : "transparent",
                  boxShadow: copied ? "0 2px 5px rgba(140, 179, 104, 0.15)" : "none"
                }}
                aria-label="复制颜色代码"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                {copied ? '已复制!' : '复制'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 md:ml-4">
          <div 
            className="p-4 rounded-lg w-full" 
            style={{ 
              height: "80px", 
              backgroundColor: pickedColor,
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
            }}
          ></div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4" style={{ color: "var(--color-primary-dark)" }}>预设颜色</h3>
        <div className="flex flex-wrap gap-3">
          {presetColors.map(color => (
            <button
              key={color}
              className="w-8 h-8 rounded-md transition-transform hover:scale-110"
              style={{ 
                backgroundColor: color,
                boxShadow: pickedColor === color 
                  ? "0 2px 5px rgba(140, 179, 104, 0.3)" 
                  : "0 1px 3px rgba(0, 0, 0, 0.1)"
              }}
              onClick={() => setPickedColor(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 判断颜色是否为亮色，用于决定文字颜色
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

// 预设颜色 - 更新为包含更多草绿色系列
const presetColors = [
  '#8cb368', '#a4c583', '#c7e0b3', '#5b7a3e', '#3e5c29', // 主题绿色系列
  '#000000', '#FFFFFF', '#F44336', '#E91E63', '#9C27B0', 
  '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', 
  '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E'
];

export default ColorPicker; 