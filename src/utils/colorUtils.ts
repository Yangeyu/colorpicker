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
 * Copy text to clipboard
 */
export const copyToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text);
}; 