declare module 'colorthief' {
  export default class ColorThief {
    getColor(image: HTMLImageElement): number[];
    getPalette(image: HTMLImageElement, colorCount?: number): number[][];
  }
} 