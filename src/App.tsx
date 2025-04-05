import { useState } from 'react'
import './App.css'
import ColorExtractor from './components/ColorExtractor'
import ColorPicker from './components/ColorPicker'

function App() {
  const [activeTab, setActiveTab] = useState<'extractor' | 'picker'>('extractor')

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      <header className="pt-10 pb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-primary-dark)" }}>颜色提取工具</h1>
        <p className="text-lg" style={{ color: "var(--color-neutral-600)" }}>从图片中提取颜色或使用颜色吸取器</p>
      </header>
      
      <div className="card-like p-6 mb-8">
        <div className="flex mb-6">
          <button
            className={`tab-btn mr-2 ${activeTab === 'extractor' ? 'active' : ''}`}
            onClick={() => setActiveTab('extractor')}
          >
            图片颜色提取
          </button>
          <button
            className={`tab-btn ${activeTab === 'picker' ? 'active' : ''}`}
            onClick={() => setActiveTab('picker')}
          >
            颜色吸取器
          </button>
        </div>
        
        <div style={{ display: activeTab === 'extractor' ? 'block' : 'none' }}>
          <ColorExtractor />
        </div>
        <div style={{ display: activeTab === 'picker' ? 'block' : 'none' }}>
          <ColorPicker />
        </div>
      </div>
      
      <footer className="text-center py-4 text-sm" style={{ color: "var(--color-neutral-500)" }}>
        <p>Linear风格颜色工具 • 简单高效的颜色处理方案</p>
      </footer>
    </div>
  )
}

export default App
