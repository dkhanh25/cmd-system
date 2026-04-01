/**
 * Mock-only constants for Module 1. These values act as placeholder assumptions until finalized.
 */

import type { Module1SystemConstantsResponseDto } from '@/types/api/module1';

export const mockModule1SystemConstants: Module1SystemConstantsResponseDto = {
  etaKn: 0.97,
  etaD: 0.96,
  etaBrc: 0.99,
  etaBrt: 0.98,
  etaOl: 0.99,
  defaultBeltRatioUd: 3.2,
  defaultGearboxRatioUhPreview: 12.5,
  notes: [
    'Mock constants for frontend integration only.',
    'Engineering formulas and default assumptions must later be aligned with the approved specification.',
  ],
};
