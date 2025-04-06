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
 * @param colorCode - Color code to copy
 * Determine if color is light, used to decide text color
 * @param color - Hex color code
 * @returns boolean - true for light color, false for dark color
 */
export const isLightColor = (color: string): boolean => {
  // Remove # and convert to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate brightness (HSP color model)
  const hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  
  // Brightness greater than 127.5 is considered light
  return hsp > 127.5;
};

/**
 * Convert HEX color to RGB format
 * @param hex - Hex color code
 * @returns string - 'rgb(r, g, b)' formatted string
 */
export const hexToRgb = (hex: string): string => {
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Convert HEX color to HSL format
 * @param hex - Hex color code
 * @returns string - 'hsl(h, s%, l%)' formatted string
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
 * Generate complementary color
 * @param hex - Hex color code
 * @returns string - Complementary color in hex
 */
export const getComplementaryColor = (hex: string): string => {
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);
  
  // Calculate complementary color (255 - original value)
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  // Convert back to hex
  return `#${((1 << 24) + (compR << 16) + (compG << 8) + compB).toString(16).slice(1)}`;
};

/**
 * Generate monochromatic color palette
 * @param hex - Base color in hex
 * @param steps - Number of color variations
 * @returns Array of hex color values
 */
export const generateMonochromaticPalette = (hex: string, steps: number = 5): string[] => {
  const result: string[] = [];
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  // Convert to HSL to adjust brightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2 / 255;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (510 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  // Create variants with different brightness levels
  for (let i = 0; i < steps; i++) {
    // Evenly distribute brightness from dark to light
    const newL = 0.1 + (i / (steps - 1)) * 0.8;
    
    // Convert back to RGB then to hex
    const resultColor = hslToHex(h, s, newL);
    result.push(resultColor);
  }

  return result;
};

/**
 * Generate analogous color palette (based on adjacent colors on the color wheel)
 * @param hex - Base color in hex
 * @param count - Number of colors
 * @returns Array of hex color values
 */
export const generateAnalogousPalette = (hex: string, count: number = 5): string[] => {
  const result: string[] = [];
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  // Convert to HSL to adjust hue
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2 / 255;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (510 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  // Angle range on color wheel is 60 degrees
  const angleStep = 60 / (count - 1) / 360;
  // Put base color in the middle
  const middle = Math.floor(count / 2);
  
  for (let i = 0; i < count; i++) {
    // Calculate offset from original color
    const offset = (i - middle) * angleStep;
    // New hue (ensure within 0-1 range)
    let newH = h + offset;
    if (newH > 1) newH -= 1;
    if (newH < 0) newH += 1;
    
    const resultColor = hslToHex(newH, s, l);
    result.push(resultColor);
  }

  return result;
};

/**
 * Generate triadic color scheme (three equidistant points on color wheel)
 * @param hex - Base color in hex
 * @returns Array of three hex colors
 */
export const generateTriadicPalette = (hex: string): string[] => {
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  // Convert to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2 / 255;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (510 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  // Create colors at 1/3 points around the color wheel
  const triadic1 = hslToHex((h + 1/3) % 1, s, l);
  const triadic2 = hslToHex((h + 2/3) % 1, s, l);

  return [hex, triadic1, triadic2];
};

/**
 * Generate tetradic color scheme (two pairs of complementary colors)
 * @param hex - Base color in hex
 * @returns Array of four hex colors
 */
export const generateTetradicPalette = (hex: string): string[] => {
  const sanitizedHex = hex.replace('#', '');
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  // Convert to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2 / 255;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (510 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  // Create points at 90-degree intervals on the color wheel
  const tetradic1 = hslToHex((h + 0.25) % 1, s, l);
  const tetradic2 = hslToHex((h + 0.5) % 1, s, l);
  const tetradic3 = hslToHex((h + 0.75) % 1, s, l);

  return [hex, tetradic1, tetradic2, tetradic3];
};

/**
 * Helper function: HSL to HEX conversion
 * @param h - Hue (0-1)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns Hex color string
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Grayscale
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Generate a complete set of color palettes
 * @param hex - Base color in hex
 * @returns Object containing various color palettes
 */
export const generateColorPalettes = (hex: string) => {
  return {
    monochromatic: generateMonochromaticPalette(hex),
    analogous: generateAnalogousPalette(hex),
    triadic: generateTriadicPalette(hex),
    tetradic: generateTetradicPalette(hex),
    complementary: [hex, getComplementaryColor(hex)]
  };
};

export const createColorResultFromHex = (hex: string): { hex: string, rgb: string, hsl: string } => {
  return {
    hex: hex,
    rgb: hexToRgb(hex),
    hsl: hexToHsl(hex)
  };
}; 
