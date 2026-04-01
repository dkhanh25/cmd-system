/**
 * Form validation helpers for the Module 1 input flow.
 */

import type { ApiFieldErrorDto } from '@/types/api/common';
import type { Module1CalculationRequestDto } from '@/types/api/module1';

export type Module1FormValues = {
  powerKw: string;
  outputRpm: string;
};

export type Module1FormErrors = {
  powerKw?: string;
  outputRpm?: string;
};

export function validateModule1Form(values: Module1FormValues): Module1FormErrors {
  const errors: Module1FormErrors = {};
  const powerKw = Number(values.powerKw);
  const outputRpm = Number(values.outputRpm);

  if (!values.powerKw.trim()) {
    errors.powerKw = 'Power is required.';
  } else if (Number.isNaN(powerKw)) {
    errors.powerKw = 'Power must be numeric.';
  } else if (powerKw <= 0) {
    errors.powerKw = 'Power must be greater than 0.';
  }

  if (!values.outputRpm.trim()) {
    errors.outputRpm = 'Output speed is required.';
  } else if (Number.isNaN(outputRpm)) {
    errors.outputRpm = 'Output speed must be numeric.';
  } else if (outputRpm <= 0) {
    errors.outputRpm = 'Output speed must be greater than 0.';
  }

  return errors;
}

export function buildModule1CalculationRequest(
  values: Module1FormValues,
): Module1CalculationRequestDto {
  return {
    input: {
      powerKw: Number(values.powerKw),
      outputRpm: Number(values.outputRpm),
    },
  };
}

export function mapApiFieldErrorsToFormErrors(
  fieldErrors?: ApiFieldErrorDto[],
): Module1FormErrors {
  const errors: Module1FormErrors = {};

  for (const fieldError of fieldErrors ?? []) {
    if (fieldError.field === 'input.powerKw') {
      errors.powerKw = fieldError.reason;
    }

    if (fieldError.field === 'input.outputRpm') {
      errors.outputRpm = fieldError.reason;
    }
  }

  return errors;
}
