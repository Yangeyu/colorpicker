import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LoadingContextType {
  isSplineLoaded: boolean;
  setSplineLoaded: (loaded: boolean) => void;
  isFontLoaded: boolean;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  isSplineLoaded: false,
  setSplineLoaded: () => {},
  isFontLoaded: false,
  isLoading: true,
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [forceLoaded, setForceLoaded] = useState(false);

  // 检测字体加载
  useEffect(() => {
    // 使用FontFaceObserver检测字体加载
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded via document.fonts.ready');
        setIsFontLoaded(true);
      }).catch(() => {
        // 如果promise被拒绝，也设置为已加载
        console.log('Fonts load failed, but continuing');
        setIsFontLoaded(true);
      });
    } else {
      // 如果浏览器不支持fonts API，设置一个超时作为备选方案
      console.log('Browser does not support document.fonts, using timeout');
      setTimeout(() => {
        setIsFontLoaded(true);
      }, 1000);
    }

    // 安全保障 - 最长30秒后强制完成加载
    const timeoutId = setTimeout(() => {
      console.log('Loading timeout reached, forcing load complete');
      setForceLoaded(true);
      setIsFontLoaded(true);
      setIsSplineLoaded(true);
    }, 30000);

    // 另一个安全保障 - 3秒后如果字体还没加载完成，就假设已加载
    const fontTimeoutId = setTimeout(() => {
      console.log('Font loading timeout reached after 3s');
      setIsFontLoaded(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(fontTimeoutId);
    };
  }, []);

  // 组合加载状态
  const isLoading = (!isSplineLoaded || !isFontLoaded) && !forceLoaded;

  const value = {
    isSplineLoaded,
    setSplineLoaded: (loaded: boolean) => {
      console.log('Setting Spline loaded:', loaded);
      setIsSplineLoaded(loaded);
    },
    isFontLoaded,
    isLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 