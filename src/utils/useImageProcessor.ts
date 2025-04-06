import { useState, useEffect, useRef, useCallback } from 'react';
import { ColorResult } from '../types';

interface UseImageProcessorOptions {
  extractColors?: boolean;
  sampleRate?: number;
}

interface UseImageProcessorReturn {
  processImage: (imageElement: HTMLImageElement) => Promise<ColorResult[]>;
  isProcessing: boolean;
}

const useImageProcessor = (options: UseImageProcessorOptions = {}): UseImageProcessorReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const sampleRate = options.sampleRate || 1;

  // Initialize worker with error handling
  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window !== 'undefined') {
      try {
        // Create a new worker with error handling
        workerRef.current = new Worker(new URL('../utils/imageWorker.ts', import.meta.url), {
          type: 'module'
        });
        
        // Set up error handler
        workerRef.current.onerror = (error) => {
          console.error('Worker error:', error);
          setIsProcessing(false);
        };
      } catch (error) {
        console.error('Failed to create web worker:', error);
      }
    }
    
    // Clean up worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  // Process image using the worker
  const processImage = useCallback(
    async (imageElement: HTMLImageElement): Promise<ColorResult[]> => {
      // If worker is not available, return empty results
      if (!workerRef.current) {
        console.error('Web worker not available');
        return [];
      }

      setIsProcessing(true);
      
      try {
        // For large images, downsample before sending to the worker
        const MAX_SIZE = 1000; // Max dimension for processing
        let width = imageElement.width;
        let height = imageElement.height;
        
        // Check if we need to resize and resize if necessary
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = Math.floor((height / width) * MAX_SIZE);
            width = MAX_SIZE;
          } else {
            width = Math.floor((width / height) * MAX_SIZE);
            height = MAX_SIZE;
          }
        }
        
        // Create a canvas to get image data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          setIsProcessing(false);
          console.error('Canvas 2D context not available');
          return [];
        }
        
        // Set canvas size to image size or resized dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image to canvas (resizing if needed)
        ctx.drawImage(imageElement, 0, 0, width, height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Process with worker
        return new Promise((resolve) => {
          if (!workerRef.current) {
            setIsProcessing(false);
            resolve([]);
            return;
          }
          
          // Handle worker response
          const handleMessage = (e: MessageEvent) => {
            const { colors, error } = e.data;
            
            workerRef.current?.removeEventListener('message', handleMessage);
            setIsProcessing(false);
            
            if (error) {
              console.error('Worker processing error:', error);
              resolve([]);
            } else {
              resolve(colors || []);
            }
          };
          
          // Set up message handler
          workerRef.current.addEventListener('message', handleMessage);
          
          // Use structured clone algorithm with transferable objects
          // This avoids copying the buffer and improves performance
          workerRef.current.postMessage(
            { 
              imageData, 
              options: { 
                sampleRate 
              } 
            },
            [imageData.data.buffer]
          );
        });
      } catch (error) {
        console.error('Error in image processing:', error);
        setIsProcessing(false);
        return [];
      }
    },
    [sampleRate]
  );

  return {
    processImage,
    isProcessing
  };
};

export default useImageProcessor; 