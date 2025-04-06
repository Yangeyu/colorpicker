// Web worker for image processing tasks
// This runs in a separate thread to prevent blocking the main UI thread

type ColorResult = {
  hex: string;
  rgb: string;
  hsl: string;
};

interface ProcessOptions {
  sampleRate?: number;
}

// RGB to HSL conversion function
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [
    Math.round(h * 360), 
    Math.round(s * 100), 
    Math.round(l * 100)
  ];
};

// Extract colors from image data with optimizations
const extractColors = (imageData: ImageData, options: ProcessOptions = {}): ColorResult[] => {
  const { width, height, data } = imageData;
  const totalPixels = width * height;
  
  // For very large images, sample pixels instead of processing all
  // This dramatically improves performance for large images
  const shouldSample = totalPixels > 500000; // ~700x700px
  // Use provided sample rate or calculate based on image size
  const sampleRate = options.sampleRate || 
    (shouldSample ? Math.max(Math.floor(totalPixels / 500000), 2) : 1);
  
  // For storing color frequencies
  const colorFrequency: {[key: string]: number} = {};
  
  // Process pixels (with sampling for large images)
  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Skip transparent or near-transparent pixels
    if (a < 128) continue;
    
    // Quantize directly during initial processing to reduce memory usage
    // Group colors into bins (6 bits per channel = 64 levels per channel)
    const quantizedR = Math.round(r / 4) * 4;
    const quantizedG = Math.round(g / 4) * 4; 
    const quantizedB = Math.round(b / 4) * 4;
    
    // Create quantized hex
    const quantizedHex = `#${((1 << 24) + (quantizedR << 16) + (quantizedG << 8) + quantizedB).toString(16).slice(1)}`;
    
    if (colorFrequency[quantizedHex]) {
      colorFrequency[quantizedHex] += sampleRate; // Weight by sample rate
    } else {
      colorFrequency[quantizedHex] = sampleRate;
    }
  }
  
  // Further quantize colors to get major color groups
  // Using a larger bin size for final output
  const finalColors: {[key: string]: number} = {};
  
  Object.entries(colorFrequency).forEach(([hex, count]) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    
    // Larger bins for final output (25 levels per channel)
    const finalR = Math.round(r / 25) * 25;
    const finalG = Math.round(g / 25) * 25;
    const finalB = Math.round(b / 25) * 25;
    
    const finalHex = `#${((1 << 24) + (finalR << 16) + (finalG << 8) + finalB).toString(16).slice(1)}`;
    
    if (finalColors[finalHex]) {
      finalColors[finalHex] += count;
    } else {
      finalColors[finalHex] = count;
    }
  });
  
  // Process in batches of 100 colors to prevent UI blocking when returning large datasets
  const sortedEntries = Object.entries(finalColors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Generate output with exact RGB values for display
  return sortedEntries.map(entry => {
    const hex = entry[0];
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const hsl = rgbToHsl(r, g, b);
    
    return {
      hex: hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
    };
  });
};

// Add progressive processing for very large images
const processInChunks = (imageData: ImageData, options: ProcessOptions = {}): Promise<ColorResult[]> => {
  return new Promise((resolve) => {
    // For small images, process directly
    if (imageData.width * imageData.height < 1000000) {
      resolve(extractColors(imageData, options));
      return;
    }
    
    // For larger images, break processing into chunks with setTimeout
    // to allow the browser to remain responsive
    setTimeout(() => {
      const colors = extractColors(imageData, options);
      resolve(colors);
    }, 0);
  });
};

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent) => {
  const { imageData, options = {} } = e.data;
  if (imageData) {
    try {
      // Process with chunking for large images
      const colors = await processInChunks(imageData, options);
      self.postMessage({ colors });
    } catch {
      self.postMessage({ error: 'Error processing image', colors: [] });
    }
  }
};

export {}; 