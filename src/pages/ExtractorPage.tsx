import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import ImageUploader from '../components/ImageUploader';
import ExtractedColors from '../components/ExtractedColors';
import { ColorResult } from '../types/index';
import { useLoading } from '../utils/LoadingContext';

// 颜色转换函数 - RGB转HSL
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
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

  return [
    Math.round(h * 360), 
    Math.round(s * 100), 
    Math.round(l * 100)
  ];
};

// 添加颜色提取函数
const extractColors = (imageElement: HTMLImageElement): ColorResult[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // 设置canvas尺寸为图片尺寸
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  
  // 在canvas上绘制图片
  ctx.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
  
  // 获取图片数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // 用于存储颜色和它们的频率
  const colorFrequency: {[key: string]: number} = {};
  
  // 对于图像中的每个像素，提取其RGB值
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // 忽略透明像素
    if (data[i + 3] < 128) continue;
    
    // 转换为hex格式并存储
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    
    if (colorFrequency[hex]) {
      colorFrequency[hex]++;
    } else {
      colorFrequency[hex] = 1;
    }
  }
  
  // 量化颜色（简化处理，实际应该用更复杂的算法）
  const quantizedColors: {[key: string]: number} = {};
  Object.keys(colorFrequency).forEach(color => {
    // 简化为RGB各自的100个等级
    const r = Math.round(parseInt(color.substring(1, 3), 16) / 25) * 25;
    const g = Math.round(parseInt(color.substring(3, 5), 16) / 25) * 25;
    const b = Math.round(parseInt(color.substring(5, 7), 16) / 25) * 25;
    
    const quantizedColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    
    if (quantizedColors[quantizedColor]) {
      quantizedColors[quantizedColor] += colorFrequency[color];
    } else {
      quantizedColors[quantizedColor] = colorFrequency[color];
    }
  });
  
  // 排序并返回前10种颜色
  return Object.entries(quantizedColors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => {
      const hex = entry[0];
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);
      const hsl = rgbToHsl(r, g, b);
      
      return {
        hex: hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
      };
    });
};

const ExtractorPage: React.FC = () => {
  const [colors, setColors] = useState<ColorResult[]>([]);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const { setSplineLoaded: setGlobalSplineLoaded } = useLoading();
  const navigate = useNavigate();

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
      img.onload = () => {
        const extractedColors = extractColors(img);
        setColors(extractedColors);
      };
      img.src = pastedImageData;
      
      // 处理完后清除sessionStorage中的数据
      sessionStorage.removeItem('pastedImageData');
    }
  }, []);

  const handleImageLoaded = (imageElement: HTMLImageElement) => {
    const extractedColors = extractColors(imageElement);
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
            Image Color Extractor
          </motion.h1>
          <div className="w-24"></div> {/* Spacer to center the title */}
        </header>

        <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
          <div className="flex-grow bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden flex items-center justify-center">
            <ImageUploader onImageLoaded={handleImageLoaded} initialImage={pastedImage} />
          </div>
          
          {colors.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 card-like px-3 py-2 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl"
            >
              <h2 className="text-lg font-semibold mb-1 text-purple-400 tech-font">Extracted Colors</h2>
              <ExtractedColors colors={colors} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExtractorPage; 