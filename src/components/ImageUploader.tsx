import React, { useState, useRef, useEffect } from 'react';

interface ImageUploaderProps {
  onImageLoaded: (imageElement: HTMLImageElement) => void;
  initialImage?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageLoaded, initialImage = null }) => {
  const [image, setImage] = useState<string | null>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 当初始图片属性变化时更新状态
  useEffect(() => {
    if (initialImage && initialImage !== image) {
      setImage(initialImage);
    }
  }, [initialImage, image]);

  // 处理图片加载
  const handleImage = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        const imgElement = new Image();
        imgElement.src = e.target.result as string;
        
        imgElement.onload = () => {
          setImage(e.target?.result as string);
          onImageLoaded(imgElement);
          setIsLoading(false);
        };
      }
    };
    
    reader.readAsDataURL(file);
  };

  // 处理拖放图片
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        handleImage(file);
      }
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImage(e.target.files[0]);
    }
  };

  // 处理粘贴事件
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImage(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragging ? 'border-purple-500 bg-purple-50 bg-opacity-10' : 'border-gray-700 hover:border-purple-400'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
        
        {isLoading ? (
          <div className="py-12">
            <div className="w-12 h-12 border-4 border-t-primary border-neutral-800 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral-400">正在处理图片...</p>
          </div>
        ) : image ? (
          <div className="image-container p-2">
            <img src={image} alt="上传的图片" className="mx-auto" />
          </div>
        ) : (
          <div className="py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-neutral-400">点击或拖放上传图片</p>
            <p className="mt-2 text-neutral-600">支持 JPG, PNG, WebP 格式</p>
            <p className="mt-4 text-purple-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              也可以直接粘贴图片 (Ctrl+V / ⌘+V)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 