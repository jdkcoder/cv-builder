// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetMini,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  safelist: ['gjs-three-bg', 'gjs-block-category', 'gjs-blocks-c', 'gjs-block'],
  shortcuts: { 
    'gjs-three-bg': '!text-light !bg-rose-4 font-medium text-sm tracking-wide hover:(!bg-rose-6)',
    'gjs-block-category': '!text-light !bg-dark-2 !p-0 rounded font-medium text-sm tracking-wide',
    'gjs-blocks-c': 'grid grid-cols-3',
    'gjs-block': 'rounded-md border border-transparent border-dashed hover:(!text-rose-4 !border-rose-4) size-full grid place-items-center'
  },

  theme: {
    colors: {
      // ...
    }
  },
  presets: [
    presetUno(),
    presetMini(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})