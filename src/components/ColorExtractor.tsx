import { useState } from 'react';
import ImageUploader from './ImageUploader';
import ColorPalette from './ColorPalette';
import { getDominantColor, getColorPalette, copyToClipboard } from '../utils/colorUtils';

const ColorExtractor = () => {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [hasImage, setHasImage] = useState(false);
  const [copiedMainColor, setCopiedMainColor] = useState(false);

  const handleImageLoaded = async (img: HTMLImageElement) => {
    try {
      setLoading(true);
      setShowTip(false);
      setHasImage(true);
      
      // Get dominant color
      const dominant = await getDominantColor(img);
      setDominantColor(dominant);
      
      // Get color palette
      const palette = await getColorPalette(img, 8);
      setColorPalette(palette);
    } catch (error) {
      console.error('Error extracting colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMainColor = async () => {
    if (!dominantColor) return;
    
    await copyToClipboard(dominantColor);
    setCopiedMainColor(true);
    setTimeout(() => setCopiedMainColor(false), 1500);
  };

  return (
    <div className="w-full overflow-hidden">
      <h2 className="text-xl font-bold mb-5" style={{ color: "var(--color-primary-dark)" }}>图片颜色提取</h2>
      
      {showTip && (
        <div className="mb-5 p-4 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)" }}>
          <p className="mb-2 font-medium" style={{ color: "var(--color-primary-dark)" }}>💡 小贴士：</p>
          <ul className="list-disc pl-5 space-y-1.5" style={{ color: "var(--color-neutral-700)" }}>
            <li>您可以直接从其他应用复制图片，然后在此页面按 Ctrl+V 粘贴</li>
            <li>支持从截图工具、浏览器或图像编辑器中粘贴图片</li>
            <li>也可以从文件管理器拖拽图片到上传区域</li>
          </ul>
        </div>
      )}
      
      <ImageUploader onImageLoaded={handleImageLoaded} />
      
      {loading && (
        <div className="my-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4" 
            style={{ 
              borderColor: "var(--color-primary)", 
              borderTopColor: "transparent" 
            }}></div>
          <p className="mt-2" style={{ color: "var(--color-neutral-600)" }}>正在提取颜色...</p>
        </div>
      )}
      
      {hasImage && !loading && (
        <div className="mt-8 space-y-8">
          {dominantColor && (
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: "var(--color-primary-dark)" }}>主要颜色</h3>
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-lg cursor-pointer relative hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: dominantColor,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                  }}
                  onClick={handleCopyMainColor}
                >
                  {copiedMainColor && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <span className="text-white font-medium">已复制!</span>
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-mono text-sm uppercase block">{dominantColor}</span>
                  <span className="text-xs mt-1 block" style={{ color: "var(--color-neutral-500)" }}>点击颜色方块复制</span>
                </div>
              </div>
            </div>
          )}
          
          {colorPalette.length > 0 && (
            <ColorPalette colors={colorPalette} />
          )}
        </div>
      )}
    </div>
  );
};

export default ColorExtractor; 