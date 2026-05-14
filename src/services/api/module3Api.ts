/**
 * Frontend-facing Module 3 API service.
 */

import type { Module3ApiContract } from '@/services/api/contracts/module3.contract';
import {
  calculateModule3Mock,
  getModule3MaterialsMock,
  getModule3HistoryMock,
} from '@/services/api/mocks/handlers/module3.handler';

export const module3Api: Module3ApiContract = {
  async getMaterials() {
    // TODO: Replace with apiClient.get(module3ApiEndpoints.getMaterials) when real HTTP is introduced.
    return getModule3MaterialsMock();
  },
  async calculate(request) {
    // TODO: Replace with apiClient.post(module3ApiEndpoints.calculate, request) when real HTTP is introduced.
    return calculateModule3Mock(request);
  },
  async getHistory(designCaseId) {
    // TODO: Replace with apiClient.get(module3ApiEndpoints.getHistory(designCaseId)) when real HTTP is introduced.
    return getModule3HistoryMock(designCaseId);
  },
};
