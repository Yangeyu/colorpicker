import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './FloatingButton.css';

const FloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleExtractorClick = () => {
    navigate('/extractor');
    setIsOpen(false);
  };

  const handlePickerClick = () => {
    navigate('/picker');
    setIsOpen(false);
  };

  return (
    <div className="floating-button-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="floating-backdrop open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              className="feature-button extractor-button"
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 20, x: 20 }}
              transition={{ delay: 0.1 }}
              onClick={handleExtractorClick}
            >
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>图片颜色提取</span>
            </motion.button>

            <motion.button
              className="feature-button picker-button"
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 20, x: 20 }}
              transition={{ delay: 0.2 }}
              onClick={handlePickerClick}
            >
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <span>颜色选择器</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <motion.button
        className="main-button"
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
      >
        <motion.div
          className="blob-outer"
          animate={{ 
            scale: [1, 1.07, 0.96, 1.05, 1],
            borderRadius: [
              "42% 58% 59% 41% / 57% 39% 61% 43%", 
              "47% 53% 42% 58% / 42% 58% 38% 62%", 
              "56% 44% 47% 53% / 38% 62% 51% 49%", 
              "42% 58% 62% 38% / 49% 51% 40% 60%", 
              "42% 58% 59% 41% / 57% 39% 61% 43%"
            ]
          }}
          transition={{ 
            duration: 5, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "mirror",
            times: [0, 0.22, 0.5, 0.78, 1]
          }}
        >
          <motion.div 
            className="blob-inner"
            animate={{ 
              scale: [1, 1.03, 0.97, 1.02, 1],
              borderRadius: [
                "42% 58% 59% 41% / 57% 39% 61% 43%", 
                "44% 56% 52% 48% / 45% 55% 50% 50%", 
                "50% 50% 42% 58% / 60% 40% 52% 48%", 
                "46% 54% 48% 52% / 45% 55% 47% 53%", 
                "42% 58% 59% 41% / 57% 39% 61% 43%"
              ]
            }}
            transition={{ 
              duration: 4, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "mirror",
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
          >
            <div className="highlight"></div>
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingButton; 