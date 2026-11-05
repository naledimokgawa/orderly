import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// Orderly "Fresh market" palette.
// brand  = deep green (#1F6F50), accent = tomato (#E4572E)
const config = defineConfig({
  globalCss: {
    'html, body': {
      bg: 'bg.canvas',
      color: 'fg',
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'var(--font-geist-sans), system-ui, sans-serif' },
        body: { value: 'var(--font-geist-sans), system-ui, sans-serif' },
        mono: { value: 'var(--font-geist-mono), ui-monospace, monospace' },
      },
      colors: {
        brand: {
          50: { value: '#E8F3EE' },
          100: { value: '#C9E3D6' },
          200: { value: '#A1CDB7' },
          300: { value: '#6FB193' },
          400: { value: '#3F9270' },
          500: { value: '#2A7F5D' },
          600: { value: '#1F6F50' },
          700: { value: '#185A41' },
          800: { value: '#124533' },
          900: { value: '#0C3124' },
          950: { value: '#071E16' },
        },
        accent: {
          50: { value: '#FDEEE9' },
          100: { value: '#FAD5C9' },
          200: { value: '#F5B09B' },
          300: { value: '#EF8A6C' },
          400: { value: '#E96F4A' },
          500: { value: '#E4572E' },
          600: { value: '#C7431D' },
          700: { value: '#A13517' },
          800: { value: '#7A2811' },
          900: { value: '#551C0C' },
          950: { value: '#33110A' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: { _light: '{colors.brand.600}', _dark: '{colors.brand.500}' } },
          contrast: { value: '#FFFFFF' },
          fg: { value: { _light: '{colors.brand.700}', _dark: '{colors.brand.300}' } },
          muted: { value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' } },
          subtle: { value: { _light: '{colors.brand.50}', _dark: '{colors.brand.950}' } },
          emphasized: { value: { _light: '{colors.brand.200}', _dark: '{colors.brand.800}' } },
          focusRing: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' } },
        },
        accent: {
          solid: { value: { _light: '{colors.accent.500}', _dark: '{colors.accent.500}' } },
          contrast: { value: '#FFFFFF' },
          fg: { value: { _light: '{colors.accent.700}', _dark: '{colors.accent.300}' } },
          muted: { value: { _light: '{colors.accent.100}', _dark: '{colors.accent.900}' } },
          subtle: { value: { _light: '{colors.accent.50}', _dark: '{colors.accent.950}' } },
          emphasized: { value: { _light: '{colors.accent.200}', _dark: '{colors.accent.800}' } },
          focusRing: { value: { _light: '{colors.accent.500}', _dark: '{colors.accent.400}' } },
        },
        bg: {
          canvas: { value: { _light: '#F7F6F2', _dark: '#111513' } },
          panel: { value: { _light: '#FFFFFF', _dark: '#1A201D' } },
        },
        fg: {
          DEFAULT: { value: { _light: '#1C2321', _dark: '#ECEFEC' } },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
