/**
 * Theme entrypoint that exposes the token bundle in a single import.
 */

import { colors, radii, spacing } from './tokens';

export const appTheme = {
  colors,
  spacing,
  radii,
} as const;
