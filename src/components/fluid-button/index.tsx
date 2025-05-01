import React, { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import "./index.css";

interface FluidButtonProps {
  onClick?: () => void;
}

const FluidButton: React.FC<FluidButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  
  useEffect(() => {
    if (message) {
      setIsMessageVisible(true);
      // Auto-hide message after 10 seconds
      const timer = setTimeout(() => {
        setIsMessageVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
    
    fetch('https://rizzapi.vercel.app/random')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMessage(data.text);
      })
      .catch(error => {
        console.error('Error fetching Rizzapi:', error);
      });
  };

  // Create variants for smoother transitions with consistent timing
  const outerVariants: Variants = {
    hover: {
      scale: 1.2,
      borderRadius: "65% 35% 40% 60% / 40% 60% 40% 60%",
      rotate: 0,
      opacity: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    idle: {
      scale: 1,
      borderRadius: "80% 60% 75% 55% / 50% 85% 40% 75%",
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    animation: {
      scale: [1, 1.15, 0.92, 1.08, 0.95],
      borderRadius: [
        "80% 60% 75% 55% / 50% 85% 40% 75%",
        "45% 85% 50% 80% / 80% 35% 85% 45%",
        "75% 45% 55% 80% / 55% 80% 50% 85%",
        "55% 90% 70% 55% / 75% 50% 55% 80%",
        "80% 60% 75% 55% / 50% 85% 40% 75%",
      ],
      rotate: [0, 3, -2, 2, 0],
      opacity: 1,
      transition: {
        duration: 14,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  const innerVariants: Variants = {
    hover: {
      scale: 0.85,
      borderRadius: "62% 38% 65% 35% / 68% 32% 55% 45%",
      rotate: 0,
      opacity: 0.65,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.05,
      },
    },
    idle: {
      scale: 1,
      borderRadius: "75% 80% 50% 85% / 85% 55% 80% 50%",
      rotate: 0,
      opacity: 0.55,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.05,
      },
    },
    animation: {
      scale: [1, 1.15, 0.85, 1.12, 0.88],
      borderRadius: [
        "75% 80% 50% 85% / 85% 55% 80% 50%",
        "80% 50% 85% 55% / 50% 85% 55% 80%",
        "50% 85% 55% 80% / 80% 50% 85% 55%",
        "85% 55% 80% 50% / 55% 80% 50% 85%",
        "75% 80% 50% 85% / 85% 55% 80% 50%",
      ],
      rotate: [-4, 3, -3, 4, -4],
      opacity: 0.55,
      transition: {
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay: 0.3,
      },
    },
  };

  const iconVariants: Variants = {
    hover: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    idle: {
      opacity: 0.3,
      scale: 0.7,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const dropsVariants: Variants = {
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    idle: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const messageBubbleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    pulse: {
      boxShadow: [
        "0 0 20px rgba(149, 98, 229, 0.3), inset 0 0 8px rgba(238, 130, 238, 0.2)",
        "0 0 25px rgba(149, 98, 229, 0.4), inset 0 0 10px rgba(238, 130, 238, 0.3)",
        "0 0 20px rgba(149, 98, 229, 0.3), inset 0 0 8px rgba(238, 130, 238, 0.2)",
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.9,
      filter: "blur(4px)",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div
      className="fluid-button-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isMessageVisible && message && (
          <motion.div
            className="message-bubble"
            variants={messageBubbleVariants}
            initial="hidden"
            animate={["visible", "pulse"]}
            exit="exit"
          >
            <div className="side-accent-left"></div>
            <div className="side-accent-right"></div>
            <div className="message-content">
              <div className="message-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M6 13a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H6m11 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-1m-5 0a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-1z" 
                    fill="url(#paint0_linear)" 
                  />
                  <defs>
                    <linearGradient id="paint0_linear" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9562E5" />
                      <stop offset="1" stopColor="#EE82EE" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="message-text">{message}</div>
            </div>
            <div className="message-arrow"></div>
            <motion.button 
              className="message-close"
              onClick={(e) => {
                e.stopPropagation();
                setIsMessageVisible(false);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="fluid-button"
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="fluid-outer"
          variants={outerVariants}
          initial="idle"
          animate={isHovered ? "hover" : "animation"}
        >
          <motion.div
            className="fluid-inner"
            variants={innerVariants}
            initial="idle"
            animate={isHovered ? "hover" : "animation"}
          />
        </motion.div>

        <motion.div
          className="robot-icon"
          variants={iconVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M6 13a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H6m11 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-1m-5 0a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-1z"
            />
          </svg>
        </motion.div>

        <motion.div
          className="water-drops"
          variants={dropsVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
        >
          <motion.span
            className="drop drop-1"
            animate={
              isHovered
                ? {
                    y: [0, -40, -30],
                    x: [0, 7, 4],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.3, 0.7],
                    rotate: [0, 20, 8],
                    transition: {
                      duration: 1.3,
                      ease: "easeOut",
                      times: [0, 0.4, 1],
                      repeat: Infinity,
                      repeatDelay: 0.6,
                    },
                  }
                : {
                    y: 0,
                    x: 0,
                    opacity: 0,
                    scale: 0.8,
                    rotate: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }
            }
          />
          <motion.span
            className="drop drop-2"
            animate={
              isHovered
                ? {
                    y: [0, -32, -20],
                    x: [0, -5, -2],
                    opacity: [0, 1, 0],
                    scale: [0.7, 1.2, 0.6],
                    rotate: [0, -15, -7],
                    transition: {
                      duration: 1.5,
                      ease: "easeOut",
                      times: [0, 0.4, 1],
                      repeat: Infinity,
                      repeatDelay: 0.2,
                      delay: 0.2,
                    },
                  }
                : {
                    y: 0,
                    x: 0,
                    opacity: 0,
                    scale: 0.7,
                    rotate: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.05,
                    },
                  }
            }
          />
          <motion.span
            className="drop drop-3"
            animate={
              isHovered
                ? {
                    y: [0, -28, -15],
                    x: [0, -3, 5],
                    opacity: [0, 1, 0],
                    scale: [0.6, 1.1, 0.5],
                    rotate: [0, 12, 3],
                    transition: {
                      duration: 1.2,
                      ease: "easeOut",
                      times: [0, 0.4, 1],
                      repeat: Infinity,
                      repeatDelay: 0.4,
                      delay: 0.3,
                    },
                  }
                : {
                    y: 0,
                    x: 0,
                    opacity: 0,
                    scale: 0.6,
                    rotate: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.1,
                    },
                  }
            }
          />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FluidButton;
