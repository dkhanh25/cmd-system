import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineError } from '@/components/ui/InlineError';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { LoadingState } from '@/components/ui/LoadingState';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { routes } from '@/constants/routes';
import { UI_TEXT } from '@/constants/uiText';
import { ShaftDetailCard } from '@/features/module1/components/ShaftDetailCard';
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
} from '@/features/module1/utils/formatters';
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
          title={UI_TEXT.states.noCalculationResultTitle}
          description={UI_TEXT.states.noCalculationResultDescription}
          actionLabel={UI_TEXT.actions.newCalculation}
          onAction={() => router.replace(routes.calculationsNew)}
        />
      </ScreenContainer>
    );
  }

  if (viewState === 'error') {
    return (
      <ScreenContainer>
        <InlineError message={UI_TEXT.states.unableToCalculate} />
        <Button
          label={UI_TEXT.actions.newCalculation}
          onPress={() => router.replace(routes.calculationsNew)}
        />
      </ScreenContainer>
    );
  }

  if (viewState === 'loading' || !result) {
    return (
      <ScreenContainer>
        <LoadingState
          title={UI_TEXT.states.loadingSavedResultsTitle}
          description={UI_TEXT.states.loadingSavedResultsDescription}
        />
      </ScreenContainer>
    );
  }

  const noteItems = collectNoteItems(result);

  return (
    <ScreenContainer>
      <View style={styles.badges}>
        <Badge label={UI_TEXT.badge.module1} />
        <Badge label={result.requestId} />
      </View>

      <Section
        title={UI_TEXT.results.title}
        description={UI_TEXT.results.description}
      />

      <Card
        title={UI_TEXT.results.inputSummaryTitle}
        description={UI_TEXT.results.inputSummaryDescription}>
        <KeyValueList
          items={[
            {
              label: UI_TEXT.fields.powerLabel,
              value: formatPowerKw(result.inputEcho.powerKw),
            },
            {
              label: UI_TEXT.fields.outputSpeedLabel,
              value: formatRpm(result.inputEcho.outputRpm),
            },
            {
              label: UI_TEXT.results.requestId,
              value: result.requestId,
              valueVariant: 'bodySmallStrong',
            },
          ]}
        />
      </Card>

      <Card
        title={UI_TEXT.results.selectedMotorTitle}
        description={UI_TEXT.results.selectedMotorDescription}>
        <KeyValueList
          items={[
            {
              label: UI_TEXT.results.motorCode,
              value: result.selectedMotor.code,
              valueVariant: 'bodySmallStrong',
            },
            {
              label: UI_TEXT.results.motorName,
              value: result.selectedMotor.name,
              valueVariant: 'bodySmallStrong',
            },
            {
              label: UI_TEXT.results.ratedPower,
              value: formatPowerKw(result.selectedMotor.ratedPowerKw),
            },
            {
              label: UI_TEXT.results.ratedSpeed,
              value: formatRpm(result.selectedMotor.ratedRpm),
            },
            {
              label: UI_TEXT.results.phase,
              value: result.selectedMotor.phase,
              valueVariant: 'bodySmallStrong',
            },
          ]}
        />
      </Card>

      <Card
        title={UI_TEXT.results.systemEfficiencyTitle}
        description={UI_TEXT.results.systemEfficiencyDescription}>
        <KeyValueList
          items={[
            {
              label: UI_TEXT.results.systemEfficiencyLabel,
              value: formatRatio(result.systemEfficiency),
              valueVariant: 'sectionTitle',
            },
          ]}
        />
      </Card>

      <Card
        tone="accent"
        title={UI_TEXT.results.requiredMotorPowerTitle}
        description={UI_TEXT.results.requiredMotorPowerDescription}>
        <KeyValueList
          items={[
            {
              label: UI_TEXT.results.requiredMotorPowerLabel,
              value: formatPowerKw(result.requiredMotorPowerKw),
              valueVariant: 'sectionTitle',
            },
          ]}
        />
      </Card>

      <Card
        title={UI_TEXT.results.transmissionRatiosTitle}
        description={UI_TEXT.results.transmissionRatiosDescription}>
        <KeyValueList
          items={[
            {
              label: UI_TEXT.results.overallRatio,
              value: formatRatio(result.transmissionRatios.total),
            },
            { label: UI_TEXT.results.beltU1, value: formatRatio(result.transmissionRatios.beltU1) },
            {
              label: UI_TEXT.results.bevelGearU2,
              value: formatRatio(result.transmissionRatios.bevelGearU2),
            },
            {
              label: UI_TEXT.results.spurGearU3,
              value: formatRatio(result.transmissionRatios.spurGearU3),
            },
          ]}
        />
      </Card>

      <Card
        title={UI_TEXT.results.shaftCharacteristicsTitle}
        description={UI_TEXT.results.shaftCharacteristicsDescription}>
        {(
          Object.entries(result.shafts) as Array<
            [
              keyof Module1CalculationResponseDto['shafts'],
              Module1CalculationResponseDto['shafts'][keyof Module1CalculationResponseDto['shafts']],
            ]
          >
        ).map(([shaftKey, shaftValue]) => (
          <ShaftDetailCard
            key={shaftKey}
            title={formatShaftLabel(shaftKey)}
            power={formatPowerKw(shaftValue.powerKw)}
            rpm={formatRpm(shaftValue.rpm)}
            torque={formatTorqueNmm(shaftValue.torqueNmm)}
            summary={shaftValue.summary ?? UI_TEXT.results.noSummary}
          />
        ))}
      </Card>

      <Card
        title={UI_TEXT.results.notesTitle}
        description={UI_TEXT.results.notesDescription}>
        {noteItems.length > 0 ? (
          <View style={styles.notesList}>
            {noteItems.map((item) =>
              item.toLowerCase().includes('warning') || item.toLowerCase().includes('differs') ? (
                <InlineError key={item} message={item} />
              ) : (
                <Text key={item} variant="body" tone="secondary">
                  - {item}
                </Text>
              ),
            )}
          </View>
        ) : (
          <Text variant="body" tone="secondary">
            {UI_TEXT.results.noAdditionalNotes}
          </Text>
        )}
      </Card>

      <View style={styles.actions}>
        <Button
          label={UI_TEXT.actions.newCalculation}
          onPress={() => router.replace(routes.calculationsNew)}
        />
        <Button
          label={UI_TEXT.actions.calculationHistory}
          onPress={() => router.push(routes.calculationsHistory)}
          variant="secondary"
        />
        <Button
          label={UI_TEXT.module3.proceedToBevel}
          onPress={() => {
            // Convert string requestId to a number for the mock designCaseId
            const numericId = parseInt(result.requestId.split('-')[1]) || 1;
            router.push({
              pathname: routes.module3New as any,
              params: { designCaseId: numericId.toString() },
            });
          }}
        />
      </View>
    </ScreenContainer>
  );
}

function collectNoteItems(result: Module1CalculationResponseDto): string[] {
  const shaftWarnings = Object.values(result.shafts).flatMap((shaft) => shaft.warnings ?? []);
  const notes = [UI_TEXT.results.notes[0], UI_TEXT.results.notes[1]];

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
      return UI_TEXT.results.outputDrumShaft;
    default:
      return 'Motor Shaft';
  }
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    gap: appTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  notesList: {
    gap: appTheme.spacing.xs,
  },
  actions: {
    gap: appTheme.spacing.sm,
  },
});
