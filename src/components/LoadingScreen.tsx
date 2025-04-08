import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="loading-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      >
        <motion.div
          className="relative w-64 h-64" /* Increased size from w-48 h-48 to w-64 h-64 */
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 主要加载SVG动画 */}
          <svg 
            width="256" 
            height="256" 
            viewBox="0 0 192 192" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
          >
            {/* 静态辉光背景 - 减少抖动 */}
            <circle 
              cx="96" 
              cy="96" 
              r="90" 
              fill="url(#glowGradient)" 
              opacity="0.15"
            />

            {/* 外圈旋转环 */}
            <motion.circle 
              cx="96" 
              cy="96" 
              r="70" 
              fill="none" 
              stroke="url(#gradient1)" 
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="330"
              strokeDashoffset="70"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop" 
              }}
            />
            
            {/* 内圈波动环 - 修复闪烁问题 */}
            <motion.circle 
              cx="96" 
              cy="96" 
              r="48" 
              fill="none" 
              stroke="url(#gradient2)" 
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="240"
              strokeDashoffset="60"
              animate={{ 
                scale: [1, 1.08, 1],
                rotate: 360
              }}
              transition={{ 
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "mirror"
                },
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }
              }}
            />
            
            {/* 多层扩散波纹效果 */}
            <motion.g>
              {/* 扩散波纹 1 */}
              <motion.circle
                cx="96"
                cy="96"
                r="20"
                fill="none"
                stroke="rgba(168, 85, 247, 0.6)"
                strokeWidth="2"
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ 
                  scale: [0.8, 3, 0.8],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop"
                }}
              />
              
              {/* 扩散波纹 2 - 错开时间 */}
              <motion.circle
                cx="96"
                cy="96"
                r="20"
                fill="none"
                stroke="rgba(236, 72, 153, 0.5)"
                strokeWidth="1.5"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 3.2, 0.8],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                  delay: 1
                }}
              />
              
              {/* 扩散波纹 3 - 更大范围 */}
              <motion.circle
                cx="96"
                cy="96"
                r="15"
                fill="none"
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="1"
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ 
                  scale: [0.8, 3.5, 0.8],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{ 
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                  delay: 0.5
                }}
              />
            </motion.g>
            
            {/* 中心脉冲球 - 增强扩散效果 */}
            <motion.circle 
              cx="96" 
              cy="96" 
              r="32" /* 增大初始半径 from 26 to 32 */
              fill="url(#gradient3)"
              filter="url(#glow)"
              initial={{ opacity: 0.7 }} /* 增加初始不透明度 */
              animate={{ 
                opacity: [0.7, 0.9, 0.7], /* 增强不透明度变化范围 */
                r: [32, 48, 32] /* 增大扩散范围 */
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut" 
              }}
            />
            
            {/* 渐变定义 */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <radialGradient id="gradient3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(236, 72, 153, 0.5)" />
                <stop offset="30%" stopColor="rgba(236, 72, 153, 0.35)" />
                <stop offset="60%" stopColor="rgba(168, 85, 247, 0.25)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
              </radialGradient>
              <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.07)" />
                <stop offset="70%" stopColor="rgba(236, 72, 153, 0.03)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </radialGradient>
              
              {/* 发光滤镜效果 */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" /> 
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
          
          {/* 辅助效果粒子 - 使动画更平滑 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-purple-300"
            style={{ translateX: -2, translateY: -50 }}
            animate={{ 
              x: [0, 15, -15, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1],
              repeatType: "loop"
            }}
          />
          
          <motion.div 
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-pink-300"
            style={{ translateX: 50, translateY: 25 }}
            animate={{ 
              x: [0, -7, 7, 0],
              y: [0, 7, -7, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1],
              delay: 0.5,
              repeatType: "loop"
            }}
          />
          
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-purple-400"
            style={{ translateX: -35, translateY: 40 }}
            animate={{ 
              x: [0, -7, 7, 0],
              y: [0, -7, 7, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1],
              delay: 1,
              repeatType: "loop"
            }}
          />
          
          {/* 额外粒子 1 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-pink-200"
            style={{ translateX: 35, translateY: -45 }}
            animate={{ 
              x: [0, 12, -5, 0],
              y: [0, -10, 6, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
              delay: 0.2,
              repeatType: "loop"
            }}
          />
          
          {/* 额外粒子 2 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-purple-200"
            style={{ translateX: -50, translateY: -15 }}
            animate={{ 
              x: [0, -10, 6, 0],
              y: [0, 10, -5, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 4.5, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.35, 0.75, 1],
              delay: 1.5,
              repeatType: "loop"
            }}
          />
          
          {/* 额外粒子 3 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-indigo-300"
            style={{ translateX: 20, translateY: 55 }}
            animate={{ 
              x: [0, 8, -6, 0],
              y: [0, 12, 4, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 3.8, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1],
              delay: 0.7,
              repeatType: "loop"
            }}
          />
          
          {/* 额外粒子 4 - 微小粒子 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-0.5 h-0.5 rounded-full bg-pink-400"
            style={{ translateX: -30, translateY: -60 }}
            animate={{ 
              x: [0, -5, 7, 0],
              y: [0, -12, -3, 0],
              opacity: [0, 0.9, 0]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
              delay: 0.3,
              repeatType: "loop"
            }}
          />
          
          {/* 额外粒子 5 - 微小粒子 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-0.5 h-0.5 rounded-full bg-purple-300"
            style={{ translateX: 65, translateY: 5 }}
            animate={{ 
              x: [0, 15, 5, 0],
              y: [0, -5, 10, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 3.2, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.45, 0.75, 1],
              delay: 1.1,
              repeatType: "loop"
            }}
          />
          
          {/* 额外粒子 6 - 微小粒子 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-0.5 h-0.5 rounded-full bg-fuchsia-300"
            style={{ translateX: -65, translateY: 25 }}
            animate={{ 
              x: [0, -12, -2, 0],
              y: [0, 4, -8, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: 4.3, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.7, 1],
              delay: 0.6,
              repeatType: "loop"
            }}
          />
          
          {/* 新增粒子 7 - 中等粒子 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-purple-500"
            style={{ translateX: 75, translateY: -35 }}
            animate={{ 
              x: [0, 20, -10, 0],
              y: [0, -15, -5, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1],
              delay: 0.3,
              repeatType: "loop"
            }}
          />
          
          {/* 新增粒子 8 - 中等粒子 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-pink-400"
            style={{ translateX: -80, translateY: -40 }}
            animate={{ 
              x: [0, -25, -5, 0],
              y: [0, -20, 10, 0],
              opacity: [0, 0.9, 0]
            }}
            transition={{ 
              duration: 4.8, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.35, 0.75, 1],
              delay: 1.2,
              repeatType: "loop"
            }}
          />
          
          {/* 新增粒子 9 - 大粒子 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ translateX: 10, translateY: 70 }}
            animate={{ 
              x: [0, 30, 10, 0],
              y: [0, 20, 40, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
              delay: 0.8,
              repeatType: "loop"
            }}
          />
          
          {/* 新增粒子 10 - 闪烁粒子 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white"
            style={{ translateX: -20, translateY: -75 }}
            animate={{ 
              scale: [0.8, 1.5, 0.8],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;