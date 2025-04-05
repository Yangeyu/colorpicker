import { defineConfig, presetAttributify, presetTypography } from 'unocss'
import { presetWind3 } from '@unocss/preset-wind3'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTypography(),
  ],
  // Add custom rules, shortcuts, and theme here if needed
  theme: {
    colors: {
      // Custom colors can be defined here
    },
  },
  shortcuts: {
    // Custom shortcuts can be defined here
    // 'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
  },
}) 