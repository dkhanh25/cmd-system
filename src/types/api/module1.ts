/**
 * Module 1 API request and response DTOs. These shapes are the public contract, not UI state.
 */

import type { ApiSuccessListDto } from './common';

export interface MotorCatalogItemDto {
  id: string;
  code: string;
  name: string;
  ratedPowerKw: number;
  ratedRpm: number;
  phase: '3-phase';
  metadata?: {
    manufacturer?: string;
    frameSize?: string;
    efficiencyClass?: string;
  };
}

export type MotorCatalogResponseDto = ApiSuccessListDto<MotorCatalogItemDto>;

export interface Module1SystemConstantsResponseDto {
  etaKn: number;
  etaD: number;
  etaBrc: number;
  etaBrt: number;
  etaOl: number;
  defaultBeltRatioUd: number;
  defaultGearboxRatioUhPreview: number;
  notes: string[];
}

export interface Module1CalculationInputDto {
  powerKw: number;
  outputRpm: number;
}

export interface Module1CalculationOverridesDto {
  etaKn?: number;
  etaD?: number;
  etaBrc?: number;
  etaBrt?: number;
  etaOl?: number;
  beltRatioUd?: number;
  gearboxRatioPreviewUh?: number;
}

export interface Module1CalculationRequestDto {
  input: Module1CalculationInputDto;
  optionalOverrides?: Module1CalculationOverridesDto;
}

export interface TransmissionRatiosDto {
  total: number;
  beltU1: number;
  bevelGearU2: number;
  spurGearU3: number;
}

export interface ShaftResultDto {
  powerKw: number;
  rpm: number;
  torqueNmm: number;
  summary?: string;
  warnings?: string[];
  metadata?: Record<string, string | number | boolean>;
}

export interface Module1CalculationResponseDto {
  requestId: string;
  inputEcho: Module1CalculationInputDto;
  selectedMotor: MotorCatalogItemDto;
  systemEfficiency: number;
  requiredMotorPowerKw: number;
  transmissionRatios: TransmissionRatiosDto;
  shafts: {
    motor: ShaftResultDto;
    shaft1: ShaftResultDto;
    shaft2: ShaftResultDto;
    shaft3: ShaftResultDto;
    drumShaft: ShaftResultDto;
  };
}
