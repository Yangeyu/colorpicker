import ColorThief from 'colorthief';

// ColorThief library provides color extraction functionality

/**
 * Convert RGB array to hex string
 */
export const rgbToHex = (rgb: number[]): string => {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Extract dominant color from an image
 */
export const getDominantColor = async (imgEl: HTMLImageElement): Promise<string> => {
  const colorThief = new ColorThief();
  const dominantColor = colorThief.getColor(imgEl);
  return rgbToHex(dominantColor);
};

/**
 * Extract color palette from an image
 */
export const getColorPalette = async (imgEl: HTMLImageElement, colorCount: number = 8): Promise<string[]> => {
  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(imgEl, colorCount);
  return palette.map((color: number[]) => rgbToHex(color));
};

/**
 * 将颜色代码复制到剪贴板
 * @param colorCode - 要复制的颜色代码
 * @returns Promise<void>
 */
export const copyToClipboard = async (colorCode: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(colorCode);
  } catch (err) {
    console.error('无法复制颜色到剪贴板:', err);
    throw err;
  }
};

/**
 * 判断颜色是否为亮色，用于决定文字颜色
 * @param color - 16进制颜色代码
 * @returns boolean - true表示亮色，false表示暗色
 */
export const isLightColor = (color: string): boolean => {
  // 移除#并转换为RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // 计算亮度 (HSP色彩模型)
  const hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  
  // 亮度大于127.5认为是亮色
  return hsp > 127.5;
};

/**
 * 将HEX颜色转换为RGB格式
 * @param hex - 16进制颜色代码
 * @returns string - 'rgb(r, g, b)'格式的字符串
 */
export const hexToRgb = (hex: string): string => {
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * 将HEX颜色转换为HSL格式
 * @param hex - 16进制颜色代码
 * @returns string - 'hsl(h, s%, l%)' 格式的字符串
 */
export const hexToHsl = (hex: string): string => {
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16) / 255;
  const g = parseInt(sanitizedHex.substring(2, 4), 16) / 255;
  const b = parseInt(sanitizedHex.substring(4, 6), 16) / 255;
  
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
  
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

/**
 * 生成互补色
 * @param hex - 16进制颜色代码
 * @returns string - 互补色的16进制颜色代码
 */
export const getComplementaryColor = (hex: string): string => {
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);
  
  // 计算互补色 (255 - 原值)
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  // 转换回16进制
  return `#${((1 << 24) + (compR << 16) + (compG << 8) + compB).toString(16).slice(1)}`;
}; 