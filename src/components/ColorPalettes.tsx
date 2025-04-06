import React from 'react';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';

interface ColorPalettesProps {
  palettes: {
    monochromatic: string[];
    analogous: string[];
    triadic: string[];
    tetradic: string[];
    complementary: string[];
  };
  activeFormat: 'hex' | 'rgb' | 'hsl';
}

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const ColorPalettes: React.FC<ColorPalettesProps> = ({ palettes, activeFormat }) => {
  // Handle color copy
  const handleCopy = (color: string, format: string) => {
    toast.success(`Copied ${format}: ${color}`);
  };

  // Get color format value
  const getColorValue = (hex: string, format: ColorFormat): string => {
    if (format === 'hex') return hex;
    
    // Convert to RGB
    if (format === 'rgb') {
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Convert to HSL
    if (format === 'hsl') {
      const r = parseInt(hex.substring(1, 3), 16) / 255;
      const g = parseInt(hex.substring(3, 5), 16) / 255;
      const b = parseInt(hex.substring(5, 7), 16) / 255;
      
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
    }
    
    return hex;
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-purple-400 tech-font">Generated Palettes</h2>
      </div>
      
      <div className="space-y-5 overflow-auto flex-grow">
        {/* Monochromatic palette */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-pink-400 tech-font">Monochromatic</h3>
          <div className="flex h-11 rounded-xl overflow-hidden shadow-lg">
            {palettes.monochromatic.map((color, index) => (
              <CopyToClipboard 
                key={index}
                text={getColorValue(color, activeFormat)} 
                onCopy={() => handleCopy(getColorValue(color, activeFormat), activeFormat.toUpperCase())}
              >
                <motion.div 
                  className="h-full grow relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 10,
                    boxShadow: "0 0 15px rgba(0,0,0,0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1.5 px-3 rounded shadow-lg text-xs font-mono text-white">
                      {getColorValue(color, activeFormat)}
                    </div>
                  </div>
                </motion.div>
              </CopyToClipboard>
            ))}
          </div>
        </div>
        
        {/* Analogous palette */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-pink-400 tech-font">Analogous</h3>
          <div className="flex h-11 rounded-xl overflow-hidden shadow-lg">
            {palettes.analogous.map((color, index) => (
              <CopyToClipboard 
                key={index}
                text={getColorValue(color, activeFormat)} 
                onCopy={() => handleCopy(getColorValue(color, activeFormat), activeFormat.toUpperCase())}
              >
                <motion.div 
                  className="h-full grow relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 10,
                    boxShadow: "0 0 15px rgba(0,0,0,0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1.5 px-3 rounded shadow-lg text-xs font-mono text-white">
                      {getColorValue(color, activeFormat)}
                    </div>
                  </div>
                </motion.div>
              </CopyToClipboard>
            ))}
          </div>
        </div>
        
        {/* Triadic palette */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-pink-400 tech-font">Triadic</h3>
          <div className="flex h-11 rounded-xl overflow-hidden shadow-lg">
            {palettes.triadic.map((color, index) => (
              <CopyToClipboard 
                key={index}
                text={getColorValue(color, activeFormat)} 
                onCopy={() => handleCopy(getColorValue(color, activeFormat), activeFormat.toUpperCase())}
              >
                <motion.div 
                  className="h-full grow relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 10,
                    boxShadow: "0 0 15px rgba(0,0,0,0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1.5 px-3 rounded shadow-lg text-xs font-mono text-white">
                      {getColorValue(color, activeFormat)}
                    </div>
                  </div>
                </motion.div>
              </CopyToClipboard>
            ))}
          </div>
        </div>
        
        {/* Tetradic palette */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-pink-400 tech-font">Tetradic</h3>
          <div className="flex h-11 rounded-xl overflow-hidden shadow-lg">
            {palettes.tetradic.map((color, index) => (
              <CopyToClipboard 
                key={index}
                text={getColorValue(color, activeFormat)} 
                onCopy={() => handleCopy(getColorValue(color, activeFormat), activeFormat.toUpperCase())}
              >
                <motion.div 
                  className="h-full grow relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 10,
                    boxShadow: "0 0 15px rgba(0,0,0,0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1.5 px-3 rounded shadow-lg text-xs font-mono text-white">
                      {getColorValue(color, activeFormat)}
                    </div>
                  </div>
                </motion.div>
              </CopyToClipboard>
            ))}
          </div>
        </div>
        
        {/* Complementary colors */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-pink-400 tech-font">Complementary</h3>
          <div className="flex h-11 rounded-xl overflow-hidden shadow-lg">
            {palettes.complementary.map((color, index) => (
              <CopyToClipboard 
                key={index}
                text={getColorValue(color, activeFormat)} 
                onCopy={() => handleCopy(getColorValue(color, activeFormat), activeFormat.toUpperCase())}
              >
                <motion.div 
                  className="h-full grow relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  whileHover={{ 
                    scale: 1.03,
                    zIndex: 10,
                    boxShadow: "0 0 15px rgba(0,0,0,0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm py-1.5 px-3 rounded shadow-lg text-xs font-mono text-white">
                      {getColorValue(color, activeFormat)}
                    </div>
                  </div>
                </motion.div>
              </CopyToClipboard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalettes; 