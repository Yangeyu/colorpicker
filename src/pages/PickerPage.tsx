import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';

const PickerPage: React.FC = () => {
  const selectedColor = '#a855f7'; // 示例颜色，更新为紫色
  const navigate = useNavigate();

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
            颜色选择器
          </motion.h1>
          <div className="w-24"></div> {/* Spacer to center the title */}
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="card-like p-6">
            <ColorPicker />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 card-like"
          >
            <h2 className="text-xl font-semibold mb-4 text-purple-400">颜色信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-pink-400 mb-2">HEX</h3>
                <div className="flex items-center">
                  <span className="font-mono text-lg text-white">{selectedColor}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(selectedColor)}
                    className="ml-2 p-1 text-gray-400 hover:text-purple-400"
                    title="复制HEX值"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-pink-400 mb-2">RGB</h3>
                <div className="flex items-center">
                  {(() => {
                    const r = parseInt(selectedColor.substring(1, 3), 16);
                    const g = parseInt(selectedColor.substring(3, 5), 16);
                    const b = parseInt(selectedColor.substring(5, 7), 16);
                    const rgbValue = `rgb(${r}, ${g}, ${b})`;
                    
                    return (
                      <>
                        <span className="font-mono text-lg text-white">{rgbValue}</span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(rgbValue)}
                          className="ml-2 p-1 text-gray-400 hover:text-purple-400"
                          title="复制RGB值"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-pink-400 mb-2">HSL</h3>
                <div className="flex items-center">
                  {(() => {
                    // Convert HEX to HSL
                    const r = parseInt(selectedColor.substring(1, 3), 16) / 255;
                    const g = parseInt(selectedColor.substring(3, 5), 16) / 255;
                    const b = parseInt(selectedColor.substring(5, 7), 16) / 255;
                    
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
                    
                    const hslValue = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
                    
                    return (
                      <>
                        <span className="font-mono text-lg text-white">{hslValue}</span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(hslValue)}
                          className="ml-2 p-1 text-gray-400 hover:text-purple-400"
                          title="复制HSL值"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-pink-400">颜色预览</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div 
                    className="h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm box-glow" 
                    style={{ backgroundColor: selectedColor }}
                  >
                    按钮颜色
                  </div>
                  <div 
                    className="h-24 rounded-lg p-4 flex flex-col justify-center shadow-sm"
                    style={{ backgroundColor: 'rgb(17, 24, 39)', color: selectedColor, borderColor: selectedColor, borderWidth: '2px' }}
                  >
                    <h4 className="font-bold" style={{ color: selectedColor }}>文本颜色</h4>
                    <p className="text-sm">这是使用所选颜色作为文本颜色的效果展示</p>
                  </div>
                  <div 
                    className="h-24 rounded-lg flex items-center justify-center shadow-sm" 
                    style={{ backgroundColor: 'rgb(17, 24, 39)', border: `8px solid ${selectedColor}` }}
                  >
                    边框颜色
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PickerPage; 