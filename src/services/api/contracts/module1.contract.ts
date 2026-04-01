/**
 * Public Module 1 API contract that frontend services and future HTTP implementations should follow.
 */

import type { ApiErrorResponseDto } from '@/types/api/common';
import type {
  Module1CalculationRequestDto,
  Module1CalculationResponseDto,
  Module1SystemConstantsResponseDto,
  MotorCatalogResponseDto,
} from '@/types/api/module1';

export const module1ApiEndpoints = {
  getMotorCatalog: '/catalog/motors',
  getSystemConstants: '/system/constants/module-1',
  createCalculation: '/calculations/module-1',
} as const;

export interface Module1ApiContract {
  getMotorCatalog(): Promise<MotorCatalogResponseDto>;
  getSystemConstants(): Promise<Module1SystemConstantsResponseDto>;
  createCalculation(
    request: Module1CalculationRequestDto,
  ): Promise<Module1CalculationResponseDto>;
}

export interface Module1ApiExamples {
  createCalculationSuccess: Module1CalculationResponseDto;
  createCalculationValidationError: ApiErrorResponseDto;
  createCalculationNoMotorError: ApiErrorResponseDto;
}
