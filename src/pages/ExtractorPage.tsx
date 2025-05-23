import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import ImageUploader from '../components/ImageUploader';
import ExtractedColors from '../components/ExtractedColors';
import BackButton from '../components/BackButton';
import { ColorResult } from '../types';
import { useLoading } from '../utils/LoadingContext';
import useImageProcessor from '../utils/useImageProcessor';

// Color processing is now handled by the web worker for better performance

const ExtractorPage: React.FC = () => {
  const [colors, setColors] = useState<ColorResult[]>([]);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const { setSplineLoaded: setGlobalSplineLoaded } = useLoading();
  // Use our optimization hook for image processing
  const { processImage, isProcessing } = useImageProcessor({ sampleRate: 2 });

  // Handle Spline load
  const handleSplineLoad = () => {
    console.log('Extractor page Spline loaded successfully!');
    setGlobalSplineLoaded(true);
  };

  // Handle Spline error
  const handleSplineError = (event: React.SyntheticEvent<HTMLDivElement, Event>) => {
    console.error('Spline loading error:', event);
    setGlobalSplineLoaded(true);
  };

  // 处理由HomePage传递过来的粘贴图片
  useEffect(() => {
    const pastedImageData = sessionStorage.getItem('pastedImageData');
    if (pastedImageData) {
      setPastedImage(pastedImageData);
      
      // 加载图片并提取颜色
      const img = new Image();
      img.onload = async () => {
        const extractedColors = await processImage(img);
        setColors(extractedColors);
      };
      img.src = pastedImageData;
      
      // 处理完后清除sessionStorage中的数据
      sessionStorage.removeItem('pastedImageData');
    }
  }, [processImage]);

  const handleImageLoaded = async (imageElement: HTMLImageElement) => {
    const extractedColors = await processImage(imageElement);
    setColors(extractedColors);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen overflow-hidden flex flex-col bg-black py-4 relative"
    >
      {/* Spline 3D背景 */}
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

      <div className="container mx-auto flex flex-col h-full relative z-10">
        <header className="mb-4 flex items-center justify-between">
          <BackButton />
          <motion.h1 
            className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 tech-font"
            animate={{ 
              textShadow: ["0 0 5px rgba(168,85,247,0.3)", "0 0 15px rgba(168,85,247,0.7)", "0 0 5px rgba(168,85,247,0.3)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Image Color Extractor
          </motion.h1>
          <div className="w-24"></div> {/* Spacer to center the title */}
        </header>

        <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
          <div className="flex-grow bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden flex items-center justify-center">
            <ImageUploader 
              onImageLoaded={handleImageLoaded} 
              initialImage={pastedImage} 
              isProcessing={isProcessing}
            />
          </div>
          
          <AnimatePresence>
            {colors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-3 card-like px-3 py-2 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl"
              >
                <h2 className="text-lg font-semibold mb-1 text-purple-400 tech-font">Extracted Colors</h2>
                <ExtractedColors colors={colors} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ExtractorPage; 