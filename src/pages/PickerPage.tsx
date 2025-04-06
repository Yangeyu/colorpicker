import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';
import ColorPalettes from '../components/ColorPalettes';
import Spline from '@splinetool/react-spline';
import { useLoading } from '../utils/LoadingContext';
import { generateColorPalettes } from '../utils/colorUtils';

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const PickerPage: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#a855f7');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
  const [colorPalettes, setColorPalettes] = useState(() => generateColorPalettes(selectedColor));
  const navigate = useNavigate();
  const { setSplineLoaded: setGlobalSplineLoaded } = useLoading();

  // Update color palettes when the selected color changes
  useEffect(() => {
    setColorPalettes(generateColorPalettes(selectedColor));
  }, [selectedColor]);

  // Handle Spline load
  const handleSplineLoad = () => {
    console.log('Picker page Spline loaded successfully!');
    setGlobalSplineLoaded(true);
  };

  // Handle Spline error
  const handleSplineError = (event: React.SyntheticEvent<HTMLDivElement, Event>) => {
    console.error('Spline loading error:', event);
    setGlobalSplineLoaded(true);
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  // Handle format change
  const handleFormatChange = (format: ColorFormat) => {
    setColorFormat(format);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen overflow-hidden bg-black py-4 relative flex flex-col"
    >
      {/* Spline 3D background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Spline
          scene="https://prod.spline.design/dkVKBZcY1dc48EmX/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
          className="w-full h-full"
        />
        {/* Shadow overlay at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black to-transparent z-1 backdrop-blur-sm"></div>
      </div>

      <div className="container mx-auto relative z-10 flex flex-col h-full">
        <header className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 rounded-full bg-gray-900 text-purple-400 border border-purple-500 hover:bg-purple-900/30 transition-all tech-font"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <motion.h1 
            className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 tech-font"
            animate={{ 
              textShadow: ["0 0 5px rgba(168,85,247,0.3)", "0 0 15px rgba(168,85,247,0.7)", "0 0 5px rgba(168,85,247,0.3)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Color Picker
          </motion.h1>
          <div className="w-24"></div> {/* Spacer to center the title */}
        </header>

        <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
          {/* Color Picker - Top */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 card-like bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg"
          >
            <ColorPicker 
              initialColor={selectedColor}
              onColorChange={handleColorChange}
              activeFormat={colorFormat}
              onFormatChange={handleFormatChange}
            />
          </motion.div>
          
          {/* Color palettes - Bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-4 card-like bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg flex-grow overflow-auto"
          >
            <ColorPalettes 
              palettes={colorPalettes}
              activeFormat={colorFormat}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PickerPage; 