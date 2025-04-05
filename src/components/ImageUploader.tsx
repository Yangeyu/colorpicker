import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageLoaded: (imageElement: HTMLImageElement) => void;
}

const ImageUploader = ({ onImageLoaded }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);
  
  const handleImage = useCallback((file: File) => {
    if (!file) return;
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Create an image element from the file
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      onImageLoaded(img);
      // No need to revoke objectURL here as we want to keep the preview
    };
    img.src = objectUrl;
  }, [onImageLoaded]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleImage(file);
    }
  }, [handleImage]);
  
  // Handle paste event
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setPasteStatus('图片已粘贴，正在处理...');
            handleImage(file);
            setPasteStatus(null);
            break;
          }
        }
      }
    };
    
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleImage]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });
  
  return (
    <div className="w-full overflow-hidden">
      {!preview ? (
        <div 
          {...getRootProps()} 
          className="rounded-lg p-8 text-center cursor-pointer transition-colors min-h-[200px] flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: isDragActive ? 'var(--color-primary-light)' : 'white',
            boxShadow: isDragActive 
              ? '0 3px 10px rgba(140, 179, 104, 0.2)' 
              : '0 2px 6px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
          }}
        >
          <input {...getInputProps()} />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" style={{ color: "var(--color-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mb-2 font-medium" style={{ color: "var(--color-neutral-700)" }}>拖放图片到此处，或点击选择图片</p>
          <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>支持 JPG, PNG, GIF 格式</p>
          <p className="mt-2 font-medium" style={{ color: "var(--color-primary-dark)" }}>您也可以使用 Ctrl+V 直接粘贴剪贴板中的图片</p>
        </div>
      ) : (
        <div className="image-container" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <img 
            src={preview} 
            alt="Uploaded preview" 
          />
          <div {...getRootProps()} className="image-overlay">
            <input {...getInputProps()} />
          </div>
        </div>
      )}
      
      {pasteStatus && (
        <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary-dark)" }}>
          {pasteStatus}
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 