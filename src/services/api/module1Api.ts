/**
 * Frontend-facing Module 1 API service. This is the main swap point from mocks to real HTTP calls later.
 */

import type { Module1ApiContract } from '@/services/api/contracts/module1.contract';
import {
  createModule1CalculationMock,
  getModule1SystemConstantsMock,
  getMotorCatalogMock,
} from '@/services/api/mocks/handlers/module1.handler';

export const module1Api: Module1ApiContract = {
  async getMotorCatalog() {
    // TODO: Replace with apiClient.get(module1ApiEndpoints.getMotorCatalog) when real HTTP is introduced.
    return getMotorCatalogMock();
  },
  async getSystemConstants() {
    // TODO: Replace with apiClient.get(module1ApiEndpoints.getSystemConstants) when real HTTP is introduced.
    return getModule1SystemConstantsMock();
  },
  async createCalculation(request) {
    // TODO: Replace with apiClient.post(module1ApiEndpoints.createCalculation, request) when real HTTP is introduced.
    return createModule1CalculationMock(request);
  },
};
