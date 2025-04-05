import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import ColorPalette from '../components/ColorPalette';

// 添加颜色提取函数
const extractColors = (imageElement: HTMLImageElement): string[] => {
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
    .map(entry => entry[0]);
};

const ExtractorPage: React.FC = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const navigate = useNavigate();

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
      className="min-h-screen bg-black py-8"
    >
      <div className="container mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <motion.button 
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 rounded-full bg-gray-900 text-purple-400 border border-purple-500 box-glow hover:bg-gray-800 transition-all"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </motion.button>
          <motion.h1 
            className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ 
              textShadow: ["0 0 5px rgba(168,85,247,0.3)", "0 0 15px rgba(168,85,247,0.7)", "0 0 5px rgba(168,85,247,0.3)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            图片颜色提取
          </motion.h1>
          <div className="w-24"></div> {/* Spacer to center the title */}
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 card-like p-6">
            <ImageUploader onImageLoaded={handleImageLoaded} initialImage={pastedImage} />
          </div>
          
          {colors.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 card-like p-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-purple-400">提取的颜色</h2>
              <ColorPalette colors={colors} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExtractorPage; 