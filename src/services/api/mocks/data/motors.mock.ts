/**
 * Mock-only motor catalog data used by the in-app fake API layer.
 */

import type { MotorCatalogItemDto } from '@/types/api/module1';

export const mockMotorCatalog: MotorCatalogItemDto[] = [
  {
    id: 'motor-001',
    code: 'MTR-3P-0.75-950',
    name: 'Three-phase induction motor 0.75kW 950rpm',
    ratedPowerKw: 0.75,
    ratedRpm: 950,
    phase: '3-phase',
    metadata: {
      manufacturer: 'Mock Drives Co.',
      frameSize: '80M',
      efficiencyClass: 'IE2',
    },
  },
  {
    id: 'motor-002',
    code: 'MTR-3P-1.10-960',
    name: 'Three-phase induction motor 1.10kW 960rpm',
    ratedPowerKw: 1.1,
    ratedRpm: 960,
    phase: '3-phase',
    metadata: {
      manufacturer: 'Mock Drives Co.',
      frameSize: '90S',
      efficiencyClass: 'IE2',
    },
  },
  {
    id: 'motor-003',
    code: 'MTR-3P-1.50-1450',
    name: 'Three-phase induction motor 1.50kW 1450rpm',
    ratedPowerKw: 1.5,
    ratedRpm: 1450,
    phase: '3-phase',
    metadata: {
      manufacturer: 'Mock Drives Co.',
      frameSize: '90L',
      efficiencyClass: 'IE2',
    },
  },
  {
    id: 'motor-004',
    code: 'MTR-3P-2.20-1460',
    name: 'Three-phase induction motor 2.20kW 1460rpm',
    ratedPowerKw: 2.2,
    ratedRpm: 1460,
    phase: '3-phase',
    metadata: {
      manufacturer: 'Mock Drives Co.',
      frameSize: '100L',
      efficiencyClass: 'IE2',
    },
  },
  {
    id: 'motor-005',
    code: 'MTR-3P-3.00-1470',
    name: 'Three-phase induction motor 3.00kW 1470rpm',
    ratedPowerKw: 3,
    ratedRpm: 1470,
    phase: '3-phase',
    metadata: {
      manufacturer: 'Mock Drives Co.',
      frameSize: '112M',
      efficiencyClass: 'IE3',
    },
  },
  {
    id: 'motor-006',
    code: 'MTR-3P-4.00-1475',
    name: 'Three-phase induction motor 4.00kW 1475rpm',
    ratedPowerKw: 4,
    ratedRpm: 1475,
    phase: '3-phase',
    metadata: {
      manufacturer: 'Mock Drives Co.',
      frameSize: '132S',
      efficiencyClass: 'IE3',
    },
  },
];
