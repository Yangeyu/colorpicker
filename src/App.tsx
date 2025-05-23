import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { LoadingProvider, useLoading } from './utils/LoadingContext'
import LoadingScreen from './components/LoadingScreen'
import { Toaster } from 'react-hot-toast'

// 页面组件
import HomePage from './pages/HomePage'
import ExtractorPage from './pages/ExtractorPage'
import PalettePage from './pages/PalettePage'

// 包装应用的组件，处理加载状态
const AppContent: React.FC = () => {
  const { isLoading } = useLoading();
  
  // 记录加载状态变化
  useEffect(() => {
    console.log('App loading state changed:', isLoading);
  }, [isLoading]);
  
  // 添加一个最大加载时间的安全措施
  useEffect(() => {
    if (!isLoading) {
      console.log('App ready to render content');
    }
  }, [isLoading]);
  
  return (
    <>
      {isLoading && <LoadingScreen />}
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #4b5563',
          },
          success: {
            iconTheme: {
              primary: '#a855f7',
              secondary: '#1f2937',
            },
          }
        }}
      />
      
      {/* 即使在加载中也预先渲染Routes，但用绝对定位和z-index使其位于加载屏幕之下 */}
      <div className={`min-h-screen w-full bg-black ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/extractor" element={<ExtractorPage />} />
          <Route path="/palette" element={<PalettePage />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <LoadingProvider>
      <Router>
        <AppContent />
      </Router>
    </LoadingProvider>
  )
}

export default App
