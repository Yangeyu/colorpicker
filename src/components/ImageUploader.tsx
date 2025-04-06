import React, { useState, useRef, useEffect } from 'react';

interface ImageUploaderProps {
  onImageLoaded: (imageElement: HTMLImageElement) => void;
  initialImage?: string | null;
  isProcessing?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageLoaded, 
  initialImage = null, 
  isProcessing = false
}) => {
  const [image, setImage] = useState<string | null>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileReaderRef = useRef<FileReader | null>(null);

  // 当初始图片属性变化时更新状态
  useEffect(() => {
    if (initialImage && initialImage !== image) {
      setImage(initialImage);
      setImageLoading(true);
      setShowPlaceholder(true);
    }
  }, [initialImage, image]);

  // Initialize FileReader once
  useEffect(() => {
    // Create and configure FileReader
    fileReaderRef.current = new FileReader();
    
    const reader = fileReaderRef.current;
    
    reader.onload = (e) => {
      if (e.target?.result) {
        // Use requestAnimationFrame to prevent UI blocking
        requestAnimationFrame(() => {
          const imgElement = new Image();
          imgElement.src = e.target?.result as string;
          setImageLoading(true);
          setShowPlaceholder(false);
          
          imgElement.onload = () => {
            // Update state in a non-blocking way
            requestAnimationFrame(() => {
              setImage(e.target?.result as string);
              onImageLoaded(imgElement);
              setInternalLoading(false);
              // Begin transition after image is loaded
              setTimeout(() => setImageLoading(false), 100);
            });
          };
        });
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      setInternalLoading(false);
      setImageLoading(false);
    };
    
    return () => {
      if (fileReaderRef.current && fileReaderRef.current.readyState === 1) {
        fileReaderRef.current.abort();
      }
    };
  }, [onImageLoaded]);

  // Use a Worker to handle image resize for large images before processing
  const handleImage = (file: File) => {
    // Show loading immediately
    setInternalLoading(true);
    setImageLoading(true);
    
    // Skip processing for small files (less than 2MB)
    if (file.size < 2 * 1024 * 1024) {
      if (fileReaderRef.current) {
        fileReaderRef.current.readAsDataURL(file);
      }
      return;
    }
    
    // For large files, use createImageBitmap for better performance
    const url = URL.createObjectURL(file);
    
    // Use requestAnimationFrame to prevent UI blocking
    requestAnimationFrame(() => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 1200px width/height)
        const MAX_SIZE = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to data URL with reduced quality
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          
          // Update UI with resized image
          requestAnimationFrame(() => {
            setImage(resizedDataUrl);
            setShowPlaceholder(false);
            
            // Create new image from resized data
            const processImg = new Image();
            processImg.onload = () => {
              onImageLoaded(processImg);
              setInternalLoading(false);
              // Begin transition after image is loaded
              setTimeout(() => setImageLoading(false), 100);
            };
            processImg.src = resizedDataUrl;
          });
        } else {
          // Fallback if canvas context unavailable
          setImage(url);
          setShowPlaceholder(false);
          onImageLoaded(img);
          setInternalLoading(false);
          setTimeout(() => setImageLoading(false), 100);
        }
        
        // Clean up object URL
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        console.error('Error loading image');
        URL.revokeObjectURL(url);
        setInternalLoading(false);
        setImageLoading(false);
      };
      
      img.src = url;
    });
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

  // Determine if we should show the loading state
  const showLoading = isProcessing || internalLoading;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        className={`relative w-full h-full flex items-center justify-center cursor-pointer transition-all ${isDragging ? 'bg-purple-50 bg-opacity-10' : ''}`}
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
        
        {showLoading && !image && (
          <div className="text-center w-64">
            <div className="w-12 h-12 border-4 border-t-primary border-neutral-800 rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-neutral-400 tech-font">Processing image...</p>
          </div>
        )}
        
        {image && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Low-quality placeholder image with blur */}
            {showPlaceholder && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-t-primary border-neutral-800 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Actual image with transition effect */}
            <img 
              src={image} 
              alt="Uploaded image" 
              className={`max-h-[60vh] max-w-full object-contain rounded-lg image-blur-transition ${imageLoading ? 'image-loading' : 'image-loaded'}`}
              onLoad={() => {
                setShowPlaceholder(false);
                setTimeout(() => setImageLoading(false), 300);
              }}
            />
          </div>
        )}
        
        {!image && !showLoading && (
          <div className="text-center py-6 px-4 h-1/2 flex flex-col justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-neutral-400 tech-font">Click or drop to upload image</p>
            <p className="mt-2 text-neutral-500 tech-font">Supports JPG, PNG, WebP formats</p>
            <p className="mt-4 text-purple-400 flex items-center justify-center tech-font">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Or paste image directly (Ctrl+V / ⌘+V)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 