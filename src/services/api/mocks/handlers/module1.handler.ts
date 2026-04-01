/**
 * Mock-only handler implementations for Module 1 endpoint behavior.
 */

import { mockMotorCatalog } from '@/services/api/mocks/data/motors.mock';
import { mockModule1SystemConstants } from '@/services/api/mocks/data/module1.constants.mock';
import { throwNoSuitableMotorError, throwValidationError } from '@/services/api/mocks/mockErrors';
import { wait } from '@/services/api/mocks/mockDelay';
import type {
  Module1CalculationOverridesDto,
  Module1CalculationRequestDto,
  Module1CalculationResponseDto,
  Module1SystemConstantsResponseDto,
  MotorCatalogItemDto,
  MotorCatalogResponseDto,
  ShaftResultDto,
  TransmissionRatiosDto,
} from '@/types/api/module1';

const MOCK_RESPONSE_DELAY_MS = 280;

export async function getMotorCatalogMock(): Promise<MotorCatalogResponseDto> {
  await wait(MOCK_RESPONSE_DELAY_MS);

  return {
    items: mockMotorCatalog,
  };
}

export async function getModule1SystemConstantsMock(): Promise<Module1SystemConstantsResponseDto> {
  await wait(MOCK_RESPONSE_DELAY_MS);
  return mockModule1SystemConstants;
}

export async function createModule1CalculationMock(
  request: Module1CalculationRequestDto,
): Promise<Module1CalculationResponseDto> {
  await wait(MOCK_RESPONSE_DELAY_MS);

  validateModule1CalculationRequest(request);

  const constants = mergeConstantsWithOverrides(request.optionalOverrides);
  const systemEfficiency = roundDecimal(
    constants.etaKn * constants.etaD * constants.etaBrc * constants.etaBrt * constants.etaOl,
  );

  // TODO: Replace this simplified placeholder math with the approved engineering formula set.
  const requiredMotorPowerKw = roundDecimal(request.input.powerKw / systemEfficiency);
  const selectedMotor = selectMotor(requiredMotorPowerKw);
  const transmissionRatios = buildTransmissionRatios({
    selectedMotorRpm: selectedMotor.ratedRpm,
    outputRpm: request.input.outputRpm,
    beltRatioUd: constants.beltRatioUd,
    gearboxRatioPreviewUh: constants.gearboxRatioPreviewUh,
  });

  return {
    requestId: createRequestId(),
    inputEcho: request.input,
    selectedMotor,
    systemEfficiency,
    requiredMotorPowerKw,
    transmissionRatios,
    shafts: buildShaftResults({
      inputPowerKw: request.input.powerKw,
      selectedMotorRpm: selectedMotor.ratedRpm,
      transmissionRatios,
    }),
  };
}

function validateModule1CalculationRequest(request: Module1CalculationRequestDto): void {
  const fieldErrors = [];

  if (!(request.input.powerKw > 0)) {
    fieldErrors.push({
      field: 'input.powerKw',
      reason: 'powerKw must be greater than 0 kW.',
    });
  }

  if (!(request.input.outputRpm > 0)) {
    fieldErrors.push({
      field: 'input.outputRpm',
      reason: 'outputRpm must be greater than 0 rpm.',
    });
  }

  if (request.optionalOverrides) {
    validateEfficiencyOverride(fieldErrors, 'optionalOverrides.etaKn', request.optionalOverrides.etaKn);
    validateEfficiencyOverride(fieldErrors, 'optionalOverrides.etaD', request.optionalOverrides.etaD);
    validateEfficiencyOverride(fieldErrors, 'optionalOverrides.etaBrc', request.optionalOverrides.etaBrc);
    validateEfficiencyOverride(fieldErrors, 'optionalOverrides.etaBrt', request.optionalOverrides.etaBrt);
    validateEfficiencyOverride(fieldErrors, 'optionalOverrides.etaOl', request.optionalOverrides.etaOl);

    if (
      request.optionalOverrides.beltRatioUd !== undefined &&
      !(request.optionalOverrides.beltRatioUd > 0)
    ) {
      fieldErrors.push({
        field: 'optionalOverrides.beltRatioUd',
        reason: 'beltRatioUd must be greater than 0.',
      });
    }

    if (
      request.optionalOverrides.gearboxRatioPreviewUh !== undefined &&
      !(request.optionalOverrides.gearboxRatioPreviewUh > 0)
    ) {
      fieldErrors.push({
        field: 'optionalOverrides.gearboxRatioPreviewUh',
        reason: 'gearboxRatioPreviewUh must be greater than 0.',
      });
    }
  }

  if (fieldErrors.length > 0) {
    throwValidationError(fieldErrors);
  }
}

function validateEfficiencyOverride(
  fieldErrors: { field: string; reason: string }[],
  field: string,
  value?: number,
): void {
  if (value !== undefined && !(value > 0 && value <= 1)) {
    fieldErrors.push({
      field,
      reason: 'Efficiency overrides must be in the range (0, 1].',
    });
  }
}

function mergeConstantsWithOverrides(optionalOverrides?: Module1CalculationOverridesDto) {
  return {
    etaKn: optionalOverrides?.etaKn ?? mockModule1SystemConstants.etaKn,
    etaD: optionalOverrides?.etaD ?? mockModule1SystemConstants.etaD,
    etaBrc: optionalOverrides?.etaBrc ?? mockModule1SystemConstants.etaBrc,
    etaBrt: optionalOverrides?.etaBrt ?? mockModule1SystemConstants.etaBrt,
    etaOl: optionalOverrides?.etaOl ?? mockModule1SystemConstants.etaOl,
    beltRatioUd: optionalOverrides?.beltRatioUd ?? mockModule1SystemConstants.defaultBeltRatioUd,
    gearboxRatioPreviewUh:
      optionalOverrides?.gearboxRatioPreviewUh ??
      mockModule1SystemConstants.defaultGearboxRatioUhPreview,
  };
}

function selectMotor(requiredMotorPowerKw: number): MotorCatalogItemDto {
  const motor = [...mockMotorCatalog]
    .sort((left, right) => left.ratedPowerKw - right.ratedPowerKw)
    .find((item) => item.ratedPowerKw >= requiredMotorPowerKw);

  if (!motor) {
    throwNoSuitableMotorError(requiredMotorPowerKw);
  }

  return motor;
}

function buildTransmissionRatios(input: {
  selectedMotorRpm: number;
  outputRpm: number;
  beltRatioUd: number;
  gearboxRatioPreviewUh: number;
}): TransmissionRatiosDto {
  const total = roundDecimal(input.selectedMotorRpm / input.outputRpm);
  const beltU1 = roundDecimal(input.beltRatioUd);

  // TODO: Align ratio distribution rules with the final Module 1 engineering decision tree.
  const remainingRatio = total / beltU1;
  const bevelGearCandidate = Math.sqrt(Math.max(remainingRatio, 1));
  const previewBias = Math.max(input.gearboxRatioPreviewUh / 10, 1);
  const bevelGearU2 = roundDecimal(Math.min(Math.max(bevelGearCandidate, 1.2), previewBias + 1.8));
  const spurGearU3 = roundDecimal(total / (beltU1 * bevelGearU2));

  return {
    total,
    beltU1,
    bevelGearU2,
    spurGearU3,
  };
}

function buildShaftResults(input: {
  inputPowerKw: number;
  selectedMotorRpm: number;
  transmissionRatios: TransmissionRatiosDto;
}): Module1CalculationResponseDto['shafts'] {
  const { inputPowerKw, selectedMotorRpm, transmissionRatios } = input;
  const shaft1Rpm = roundDecimal(selectedMotorRpm / transmissionRatios.beltU1);
  const shaft2Rpm = roundDecimal(shaft1Rpm / transmissionRatios.bevelGearU2);
  const shaft3Rpm = roundDecimal(shaft2Rpm / transmissionRatios.spurGearU3);
  const drumShaftRpm = shaft3Rpm;

  return {
    motor: createShaftResult('Motor shaft', inputPowerKw, selectedMotorRpm),
    shaft1: createShaftResult('Shaft 1 after belt stage', inputPowerKw, shaft1Rpm),
    shaft2: createShaftResult('Shaft 2 after bevel gear stage', inputPowerKw, shaft2Rpm),
    shaft3: createShaftResult('Shaft 3 after spur gear stage', inputPowerKw, shaft3Rpm),
    drumShaft: createShaftResult('Output drum shaft', inputPowerKw, drumShaftRpm, {
      warnings:
        Math.abs(drumShaftRpm - shaft3Rpm) > 0.0001
          ? ['Rounded output rpm differs slightly from upstream shaft rpm.']
          : undefined,
    }),
  };
}

function createShaftResult(
  summary: string,
  powerKw: number,
  rpm: number,
  options?: {
    warnings?: string[];
  },
): ShaftResultDto {
  const torqueNmm = rpm > 0 ? roundDecimal((9_550_000 * powerKw) / rpm) : 0;

  return {
    powerKw: roundDecimal(powerKw),
    rpm: roundDecimal(rpm),
    torqueNmm,
    summary,
    warnings: options?.warnings,
    metadata: {
      formulaStatus: 'placeholder-math',
    },
  };
}

function createRequestId(): string {
  return `module1-${Date.now()}`;
}

function roundDecimal(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}
