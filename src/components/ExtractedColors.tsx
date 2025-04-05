import React, { useState, useRef } from 'react';
import { ColorResult } from '../types/index';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ExtractedColorsProps {
  colors: ColorResult[];
}

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const ExtractedColors: React.FC<ExtractedColorsProps> = ({ colors }) => {
  const [activeFormat, setActiveFormat] = useState<ColorFormat>('hex');
  const [customColor, setCustomColor] = useState<string>('#e2e2e2');
  const colorPickerRef = useRef<HTMLInputElement>(null);
  
  // 处理颜色复制
  const handleCopy = (color: string, format: string) => {
    toast.success(`Copied ${format}: ${color}`);
  };

  // 获取当前选择的颜色格式值
  const getColorValue = (color: ColorResult, format: ColorFormat) => {
    switch (format) {
      case 'hex': return color.hex;
      case 'rgb': return color.rgb;
      case 'hsl': return color.hsl;
      default: return color.hex;
    }
  };

  // RGB颜色转换为HSL
  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  // HEX转RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'rgb(0, 0, 0)';
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // 处理自定义颜色变化
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
  };

  // 获取自定义颜色的值
  const getCustomColorValue = (format: ColorFormat): string => {
    switch (format) {
      case 'hex': return customColor;
      case 'rgb': return hexToRgb(customColor);
      case 'hsl': {
        const rgb = hexToRgb(customColor);
        const matches = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (matches) {
          return rgbToHsl(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]));
        }
        return 'hsl(0, 0%, 0%)';
      }
      default: return customColor;
    }
  };

  // 如果没有颜色，显示空状态
  if (!colors || colors.length === 0) {
    return (
      <div className="text-center text-neutral-500">
        <p>No colors extracted yet</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs tech-font text-neutral-400">
          {colors.length} colors extracted
        </span>
        <div className="flex bg-gray-800 rounded-full p-1 gap-1">
          <motion.button 
            className={`px-4 py-1.5 rounded-full text-xs tech-font transition-all ${activeFormat === 'hex' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-700'}`}
            onClick={() => setActiveFormat('hex')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HEX
          </motion.button>
          <motion.button 
            className={`px-4 py-1.5 rounded-full text-xs tech-font transition-all ${activeFormat === 'rgb' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-700'}`}
            onClick={() => setActiveFormat('rgb')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RGB
          </motion.button>
          <motion.button 
            className={`px-4 py-1.5 rounded-full text-xs tech-font transition-all ${activeFormat === 'hsl' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-700'}`}
            onClick={() => setActiveFormat('hsl')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HSL
          </motion.button>
        </div>
      </div>
      
      <div className="flex w-full justify-between space-x-4">
        {/* Extracted colors */}
        <motion.div 
          className="flex grow h-16 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {colors.map((colorResult, index) => {
            const isFirst = index === 0;
            const isLast = index === colors.length - 1;
            
            let borderRadius = "";
            if (isFirst) borderRadius = "rounded-l-2xl";
            if (isLast) borderRadius = "rounded-r-2xl";
            
            return (
              <CopyToClipboard 
                key={index}
                text={getColorValue(colorResult, activeFormat)} 
                onCopy={() => handleCopy(getColorValue(colorResult, activeFormat), activeFormat.toUpperCase())}
              >
                <motion.div 
                  className={`h-full grow relative group cursor-pointer ${borderRadius}`}
                  style={{ backgroundColor: colorResult.hex }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 10,
                    boxShadow: "0 0 15px rgba(0,0,0,0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {/* Tooltip that appears on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1.5 px-3 rounded shadow-lg text-xs font-mono text-white">
                      {getColorValue(colorResult, activeFormat)}
                    </div>
                  </div>
                </motion.div>
              </CopyToClipboard>
            );
          })}
        </motion.div>
        
        {/* Color picker - split into two parts */}
        <motion.div 
          className="flex h-16 w-28 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Left part - display picked color */}
          <CopyToClipboard 
            text={getCustomColorValue(activeFormat)} 
            onCopy={() => handleCopy(getCustomColorValue(activeFormat), activeFormat.toUpperCase())}
          >
            <motion.div 
              className="h-full w-16 relative group cursor-pointer rounded-l-2xl"
              style={{ backgroundColor: customColor }}
              whileHover={{ 
                scale: 1.03,
                zIndex: 10,
                boxShadow: "0 0 15px rgba(0,0,0,0.6)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Tooltip that appears on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1.5 px-3 rounded shadow-lg text-xs font-mono text-white">
                  {getCustomColorValue(activeFormat)}
                </div>
              </div>
            </motion.div>
          </CopyToClipboard>
          
          {/* Right part - color picker button */}
          <motion.div 
            className="h-full w-12 bg-gray-800 rounded-r-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#374151" // gray-700
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => colorPickerRef.current?.click()}
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatType: "mirror" 
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <input 
              ref={colorPickerRef}
              type="color" 
              value={customColor}
              onChange={handleColorChange}
              className="opacity-0 absolute inset-0 cursor-pointer" 
            />
          </motion.div>
        </motion.div>
      </div>
      
      <div className="mt-2 text-center text-xs text-neutral-500">
        <p>Hover to see value, click to copy</p>
      </div>
    </div>
  );
};

export default ExtractedColors; 