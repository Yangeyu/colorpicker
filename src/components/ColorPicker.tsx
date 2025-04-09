import { useState, useEffect, useRef } from 'react';
import { hexToRgb, hexToHsl, hslToHex } from '../utils/colorUtils';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';

interface ColorPickerProps {
  onColorChange?: (color: string) => void;
  initialColor?: string;
  activeFormat: 'hex' | 'rgb' | 'hsl';
  onFormatChange: (format: 'hex' | 'rgb' | 'hsl') => void;
}

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  onColorChange, 
  initialColor = '#a855f7',
  activeFormat,
  onFormatChange
}) => {
  const [pickedColor, setPickedColor] = useState<string>(initialColor);
  const [hue, setHue] = useState<number>(0);
  const hueBarRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Initialize hue value from initialColor
  useEffect(() => {
    // Extract hue from the hex color
    const hslColor = hexToHsl(initialColor);
    const hueMatch = hslColor.match(/hsl\((\d+),/);
    if (hueMatch && hueMatch[1]) {
      setHue(parseInt(hueMatch[1]));
    }
  }, [initialColor]);

  // Notify parent component when color changes
  useEffect(() => {
    if (onColorChange) {
      onColorChange(pickedColor);
    }
  }, [pickedColor, onColorChange]);

  // Get color value in active format
  const getColorValue = (format: ColorFormat): string => {
    switch (format) {
      case 'hex': return pickedColor.toUpperCase();
      case 'rgb': return hexToRgb(pickedColor);
      case 'hsl': return hexToHsl(pickedColor);
      default: return pickedColor.toUpperCase();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPickedColor(newColor);
    
    // Update hue slider based on the selected color
    const hslColor = hexToHsl(newColor);
    const hueMatch = hslColor.match(/hsl\((\d+),/);
    if (hueMatch && hueMatch[1]) {
      setHue(parseInt(hueMatch[1]));
    }
  };

  const handleHueChange = (clientX: number) => {
    if (!hueBarRef.current) return;
    
    const barRect = hueBarRef.current.getBoundingClientRect();
    const barWidth = barRect.width;
    const offsetX = Math.max(0, Math.min(clientX - barRect.left, barWidth));
    const newHue = Math.round((offsetX / barWidth) * 360);
    setHue(newHue);
    
    // Convert current color to HSL, update hue and convert back to hex
    const hslColor = hexToHsl(pickedColor);
    const [, s, l] = hslColor.match(/hsl\((\d+), (\d+)%, (\d+)%\)/)?.slice(1).map(Number) || [0, 100, 50];
    const newColor = hslToHex(newHue/360, s/100, l/100);
    setPickedColor(newColor);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    handleHueChange(e.clientX);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleHueChange(e.clientX);
      }
    };
    
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    if (e.touches[0]) {
      handleHueChange(e.touches[0].clientX);
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches[0]) {
        handleHueChange(e.touches[0].clientX);
        e.preventDefault(); // Prevent scrolling while dragging
      }
    };
    
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleEyedropperClick = () => {
    // Open the native color picker through the hidden input
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };
  
  // Handle color copy
  const handleCopy = (color: string, format: string) => {
    toast.success(`Copied ${format}: ${color}`);
  };
  
  return (
    <>
      {/* Header row with title and format options */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-purple-400 tech-font">Selected Color</h2>
        
        <div className="flex bg-gray-800 rounded-full p-0.5 gap-1">
          <motion.button 
            className={`px-3 py-1 rounded-full text-xs tech-font transition-all ${activeFormat === 'hex' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            onClick={() => onFormatChange('hex')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HEX
          </motion.button>
          <motion.button 
            className={`px-3 py-1 rounded-full text-xs tech-font transition-all ${activeFormat === 'rgb' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            onClick={() => onFormatChange('rgb')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RGB
          </motion.button>
          <motion.button 
            className={`px-3 py-1 rounded-full text-xs tech-font transition-all ${activeFormat === 'hsl' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            onClick={() => onFormatChange('hsl')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HSL
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {/* Color swatch with eyedropper and color display */}
          <div className="flex h-14 rounded-lg overflow-hidden shadow-lg">
            {/* Left part - eyedropper button */}
            <div 
              className="h-14 w-14 bg-gray-800 flex items-center justify-center cursor-pointer relative overflow-hidden"
              onClick={handleEyedropperClick}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <input
                ref={colorInputRef}
                type="color"
                value={pickedColor}
                onChange={handleColorChange}
                className="opacity-0 absolute inset-0 cursor-pointer"
                aria-label="Select color"
              />
            </div>
            
            {/* Right part - color display with copy to clipboard */}
            <CopyToClipboard 
              text={getColorValue(activeFormat)}
              onCopy={() => handleCopy(getColorValue(activeFormat), activeFormat.toUpperCase())}
            >
              <div 
                className="h-14 w-14 relative cursor-pointer group"
                style={{ backgroundColor: pickedColor }}
              >
                {/* Tooltip that appears on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1 px-2 rounded shadow-lg text-xs font-mono text-white">
                    {getColorValue(activeFormat)}
                  </div>
                </div>
              </div>
            </CopyToClipboard>
          </div>
          
          <div className="flex-1 ml-2">
            <p className="text-xs mb-1 text-neutral-300">Hue: <span className="font-mono">{hue}°</span></p>
            
            {/* HUE Bar */}
            <div 
              ref={hueBarRef}
              className="h-8 w-full rounded-lg cursor-pointer relative"
              style={{ 
                background: "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                boxShadow: "0 0 8px rgba(0,0,0,0.3)"
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {/* Hue Selector Thumb */}
              <div 
                className="absolute top-0 w-2 h-8 shadow-lg pointer-events-none"
                style={{ 
                  left: `${(hue / 360) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "2px solid white",
                  borderRadius: "3px",
                  boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)"
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">0°</span>
              <span className="text-xs text-gray-400">360°</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorPicker; 