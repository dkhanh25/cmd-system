/**
 * Core design tokens shared across screens and reusable components.
 */

export const colors = {
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF3F8',
  border: '#D6E0EA',
  textPrimary: '#132033',
  textSecondary: '#526074',
  textMuted: '#6F7E93',
  accent: '#0B6BBD',
  accentSoft: '#D9EBFA',
  success: '#217A4A',
  successSoft: '#E3F4EA',
  danger: '#B23A3A',
  dangerSoft: '#FCE7E7',
  disabled: '#B8C5D4',
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 10,
  md: 12,
  lg: 18,
} as const;
