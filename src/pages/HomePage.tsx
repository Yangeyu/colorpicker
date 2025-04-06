import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
// import FloatingButton from '../components/FloatingButton/FloatingButton';
import './HomePage.css';
import { useLoading } from '../utils/LoadingContext';

// 粘贴提示组件
const PasteHint = () => (
  <div className="paste-hint">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
    <span className="tech-font">Paste image here to auto-extract colors (Ctrl+V / ⌘+V)</span>
  </div>
);

export interface PastedImageData {
  dataUrl: string;
}

const HomePage: React.FC = () => {
  const [localSplineLoaded, setLocalSplineLoaded] = useState<boolean>(false);
  const { setSplineLoaded } = useLoading();
  const navigate = useNavigate();

  const handleSplineLoad = () => {
    console.log('Spline loaded successfully!');
    setLocalSplineLoaded(true);
    setSplineLoaded(true);
  };

  // 添加一个安全机制，如果spline加载超时，仍然显示内容
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localSplineLoaded) {
        console.log('Spline load timeout, forcing loaded state');
        setLocalSplineLoaded(true);
        setSplineLoaded(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [localSplineLoaded, setSplineLoaded]);

  // 添加粘贴事件监听，自动跳转到提取页
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            // 读取文件内容为dataURL
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                // 将图片数据保存到sessionStorage
                sessionStorage.setItem('pastedImageData', event.target.result as string);
                // 跳转到提取页
                navigate('/extractor');
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [navigate]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* 顶部内容 */}
      <div className="container mx-auto py-8 flex-1 flex flex-col items-start justify-center relative z-10">
        <div className="home-content-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl pb-10 sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{ 
                textShadow: ["0 0 5px rgba(168,85,247,0.3)", "0 0 15px rgba(168,85,247,0.7)", "0 0 5px rgba(168,85,247,0.3)"] 
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Color Extraction Tool
            </motion.h1>
            
            

            
            <div className="flex flex-col flex-row gap-8 mt-12 mb-16">
              <motion.div
                className="feature-card"
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 0 25px rgba(168,85,247,0.5)",
                  border: "1px solid rgba(168,85,247,0.8)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => handleCardClick('/extractor')}
              >
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-purple-400">Image Color Extractor</h3>
                <div className="feature-card-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                className="feature-card"
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 0 25px rgba(236,72,153,0.5)",
                  border: "1px solid rgba(236,72,153,0.8)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => handleCardClick('/picker')}
              >
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-pink-400">Color Picker</h3>
                <div className="feature-card-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.div>
            </div>
            {/* 粘贴提示移到标题下方 */}
            <PasteHint />
          </motion.div>
        </div>
      </div>

      {/* Spline 3D背景 */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {!localSplineLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-black flex items-center justify-center"
          >
            <div className="w-12 h-12 border-4 border-t-primary border-neutral-800 rounded-full animate-spin"></div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: localSplineLoaded ? 1 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-full h-full relative"
        >
          <Spline
            className="size-full absolute -z-1"
            scene="https://prod.spline.design/iBjg3wbDtoIGpOjq/scene.splinecode"
          />
          <Spline 
            scene="https://prod.spline.design/6FHEcxFacsTSn5US/scene.splinecode" 
            onLoad={handleSplineLoad}
            onError={(err) => {
              console.error('Spline loading error:', err);
              setLocalSplineLoaded(true); // 即使加载失败也显示内容
              setSplineLoaded(true);
            }}
            className="size-full z-2"
          />
          <div className="absolute bottom-0 right-0 h-20 w-50 bg-gradient-to-t from-black via-black to-transparent z-1 backdrop-blur-sm"></div>
          {/* 紫色光晕覆盖层 */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-40"></div>
        </motion.div>
      </div>

      {/* 浮动按钮 */}
      {/* <FloatingButton /> */}
    </div>
  );
};

export default HomePage; 