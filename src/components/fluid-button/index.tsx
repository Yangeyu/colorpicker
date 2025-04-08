import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import "./index.css";

interface FluidButtonProps {
  onClick?: () => void;
  href?: string;
}

const FluidButton: React.FC<FluidButtonProps> = ({ onClick, href }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, "_blank");
    }
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

  return (
    <div
      className="fluid-button-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          className="github-icon"
          variants={iconVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23.64px"
            height="20px"
            viewBox="0 0 1664 1408"
          >
            <path
              fill="currentColor"
              d="M640 960q0 40-12.5 82t-43 76t-72.5 34t-72.5-34t-43-76t-12.5-82t12.5-82t43-76t72.5-34t72.5 34t43 76t12.5 82m640 0q0 40-12.5 82t-43 76t-72.5 34t-72.5-34t-43-76t-12.5-82t12.5-82t43-76t72.5-34t72.5 34t43 76t12.5 82m160 0q0-120-69-204t-187-84q-41 0-195 21q-71 11-157 11t-157-11q-152-21-195-21q-118 0-187 84t-69 204q0 88 32 153.5t81 103t122 60t140 29.5t149 7h168q82 0 149-7t140-29.5t122-60t81-103t32-153.5m224-176q0 207-61 331q-38 77-105.5 133t-141 86t-170 47.5t-171.5 22t-167 4.5q-78 0-142-3t-147.5-12.5t-152.5-30t-137-51.5t-121-81t-86-115Q0 992 0 784q0-237 136-396q-27-82-27-170q0-116 51-218q108 0 190 39.5T539 163q147-35 309-35q148 0 280 32q105-82 187-121t189-39q51 102 51 218q0 87-27 168q136 160 136 398"
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
