/**
 * Module 1 result screen resolved from the temporary FE-only store by request id.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineError } from '@/components/ui/InlineError';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { LoadingState } from '@/components/ui/LoadingState';
import { SectionCard } from '@/components/ui/SectionCard';
import {
  getCurrentModule1HistoryEntry,
  getModule1HistoryEntryById,
  setCurrentModule1Result,
} from '@/features/module1/state/module1HistoryStore';
import {
  formatPowerKw,
  formatRatio,
  formatRpm,
  formatTorqueNmm,
} from '@/features/module1/utils/module1Formatters';
import { routes } from '@/constants/routes';
import { appTheme } from '@/theme';
import type { Module1CalculationResponseDto } from '@/types/api/module1';

type ResultViewState = 'loading' | 'ready' | 'empty' | 'error';

export function CalculationResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ requestId?: string }>();
  const [viewState, setViewState] = useState<ResultViewState>('loading');
  const [result, setResult] = useState<Module1CalculationResponseDto | null>(null);

  useEffect(() => {
    const requestId = typeof params.requestId === 'string' ? params.requestId : undefined;
    const historyEntry = requestId
      ? getModule1HistoryEntryById(requestId)
      : getCurrentModule1HistoryEntry();

    const timerId = setTimeout(() => {
      if (!historyEntry) {
        setViewState(requestId ? 'error' : 'empty');
        return;
      }

      setCurrentModule1Result(historyEntry.id);
      setResult(historyEntry.result);
      setViewState('ready');
    }, 350);

    return () => clearTimeout(timerId);
  }, [params.requestId]);

  if (viewState === 'empty') {
    return (
      <ScreenContainer>
        <EmptyState
          title="No calculation result yet"
          description="Start a Module 1 calculation first, then this screen will show grouped outputs."
          actionLabel="Start Calculation"
          onAction={() => router.replace(routes.calculationsNew)}
        />
      </ScreenContainer>
    );
  }

  if (viewState === 'error') {
    return (
      <ScreenContainer>
        <InlineError message="The result screen could not interpret the current calculation input." />
        <AppButton label="Start New Calculation" onPress={() => router.replace(routes.calculationsNew)} />
      </ScreenContainer>
    );
  }

  if (viewState === 'loading' || !result) {
    return (
      <ScreenContainer>
        <LoadingState
          title="Loading saved result"
          description="Resolving the latest Module 1 calculation from the temporary FE-only store."
        />
      </ScreenContainer>
    );
  }

  const noteItems = collectNoteItems(result);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Calculation Result</Text>
        <Text style={styles.description}>
          This page is already grouped like a real output screen so the next-step mock API hookup
          can flow directly into the same layout.
        </Text>
      </View>

      <SectionCard title="Input Summary">
        <KeyValueList
          items={[
            { label: 'Power on drum shaft', value: formatPowerKw(result.inputEcho.powerKw) },
            { label: 'Output speed', value: formatRpm(result.inputEcho.outputRpm) },
            { label: 'Request trace', value: result.requestId },
          ]}
        />
      </SectionCard>

      <SectionCard title="Selected Motor">
        <KeyValueList
          items={[
            { label: 'Motor code', value: result.selectedMotor.code },
            { label: 'Name', value: result.selectedMotor.name },
            { label: 'Rated power', value: formatPowerKw(result.selectedMotor.ratedPowerKw) },
            { label: 'Rated speed', value: formatRpm(result.selectedMotor.ratedRpm) },
            { label: 'Phase', value: result.selectedMotor.phase },
          ]}
        />
      </SectionCard>

      <SectionCard title="System Efficiency">
        <KeyValueList
          items={[
            { label: 'Combined efficiency', value: formatRatio(result.systemEfficiency) },
          ]}
        />
      </SectionCard>

      <SectionCard title="Required Motor Power">
        <KeyValueList
          items={[
            {
              label: 'Required motor power',
              value: formatPowerKw(result.requiredMotorPowerKw),
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Transmission Ratios">
        <KeyValueList
          items={[
            { label: 'Total ratio', value: formatRatio(result.transmissionRatios.total) },
            { label: 'Belt U1', value: formatRatio(result.transmissionRatios.beltU1) },
            { label: 'Bevel gear U2', value: formatRatio(result.transmissionRatios.bevelGearU2) },
            { label: 'Spur gear U3', value: formatRatio(result.transmissionRatios.spurGearU3) },
          ]}
        />
      </SectionCard>

      <SectionCard title="Shaft Characteristics">
        {(
          Object.entries(result.shafts) as Array<
            [keyof Module1CalculationResponseDto['shafts'], Module1CalculationResponseDto['shafts'][keyof Module1CalculationResponseDto['shafts']]]
          >
        ).map(([shaftKey, shaftValue]) => (
          <View key={shaftKey} style={styles.shaftBlock}>
            <Text style={styles.shaftTitle}>{formatShaftLabel(shaftKey)}</Text>
            <KeyValueList
              items={[
                { label: 'Power', value: formatPowerKw(shaftValue.powerKw) },
                { label: 'Speed', value: formatRpm(shaftValue.rpm) },
                { label: 'Torque', value: formatTorqueNmm(shaftValue.torqueNmm) },
                { label: 'Summary', value: shaftValue.summary ?? 'No summary yet' },
              ]}
            />
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Warnings / Notes">
        {noteItems.length > 0 ? (
          <View style={styles.notesList}>
            {noteItems.map((item) => (
              <Text key={item} style={styles.noteItem}>
                - {item}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.noteFallback}>No warnings were produced for this preview state.</Text>
        )}
      </SectionCard>

      <View style={styles.actions}>
        <AppButton label="Run Another Calculation" onPress={() => router.replace(routes.calculationsNew)} />
        <AppButton label="View History" onPress={() => router.push(routes.calculationsHistory)} variant="secondary" />
      </View>
    </ScreenContainer>
  );
}

function collectNoteItems(result: Module1CalculationResponseDto): string[] {
  const shaftWarnings = Object.values(result.shafts).flatMap((shaft) => shaft.warnings ?? []);
  const notes = [
    'Result data is currently sourced from the in-app mock API layer.',
    'Temporary FE-only history is used until persistence is added.',
  ];

  return [...notes, ...shaftWarnings];
}

function formatShaftLabel(key: keyof Module1CalculationResponseDto['shafts']): string {
  switch (key) {
    case 'shaft1':
      return 'Shaft 1';
    case 'shaft2':
      return 'Shaft 2';
    case 'shaft3':
      return 'Shaft 3';
    case 'drumShaft':
      return 'Drum Shaft';
    default:
      return 'Motor Shaft';
  }
}

const styles = StyleSheet.create({
  header: {
    gap: appTheme.spacing.sm,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: appTheme.colors.textPrimary,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: appTheme.colors.textSecondary,
  },
  shaftBlock: {
    gap: appTheme.spacing.xs,
    padding: appTheme.spacing.sm,
    borderRadius: appTheme.radii.md,
    backgroundColor: appTheme.colors.surfaceMuted,
  },
  shaftTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: appTheme.colors.textPrimary,
  },
  notesList: {
    gap: appTheme.spacing.xs,
  },
  noteItem: {
    fontSize: 14,
    lineHeight: 20,
    color: appTheme.colors.textPrimary,
  },
  noteFallback: {
    fontSize: 14,
    lineHeight: 20,
    color: appTheme.colors.textSecondary,
  },
  actions: {
    gap: appTheme.spacing.sm,
  },
});
