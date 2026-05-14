/**
 * Frontend-facing Module 1 API service.
 */

import { apiClient } from './apiClient';
import { module1ApiEndpoints, type Module1ApiContract } from '@/services/api/contracts/module1.contract';

export const module1Api: Module1ApiContract = {
  async getMotorCatalog() {
    return apiClient.get(module1ApiEndpoints.getMotorCatalog);
  },
  async getSystemConstants() {
    return apiClient.get(module1ApiEndpoints.getSystemConstants);
  },
  async createCalculation(request) {
    return apiClient.post(module1ApiEndpoints.createCalculation, request);
  },
};
