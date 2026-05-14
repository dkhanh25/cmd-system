import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InlineError } from '@/components/ui/InlineError';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { LoadingState } from '@/components/ui/LoadingState';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { routes } from '@/constants/routes';
import { UI_TEXT } from '@/constants/uiText';
import { module4Api } from '@/services/api';
import { SpurGeometryCard } from '@/features/module4/components/SpurGeometryCard';
import { SpurStressCheckCard } from '@/features/module4/components/SpurStressCheckCard';
import { DerivedFactorsCard } from '@/features/module4/components/DerivedFactorsCard';
import { ShaftForcesCard } from '@/features/module3/components/ShaftForcesCard';
import { appTheme } from '@/theme';
import type { Module4CalculationResponseDto } from '@/types/api/module4';

export function Module4ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ designCaseId: string }>();
  const designCaseId = Number(params.designCaseId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Module4CalculationResponseDto | null>(null);

  useEffect(() => {
    async function loadResult() {
      if (isNaN(designCaseId)) {
        setError('Invalid Design Case ID');
        setIsLoading(false);
        return;
      }

      try {
        const data = await module4Api.getHistory(designCaseId);
        setResult(data);
      } catch {
        setError('Unable to load Module 4 results.');
      } finally {
        setIsLoading(false);
      }
    }

    loadResult();
  }, [designCaseId]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState
          title={UI_TEXT.states.loadingSavedResultsTitle}
          description={UI_TEXT.states.loadingSavedResultsDescription}
        />
      </ScreenContainer>
    );
  }

  if (error || !result) {
    return (
      <ScreenContainer>
        <InlineError message={error || 'No result found.'} />
        <Button
          label={UI_TEXT.actions.backToHome}
          onPress={() => router.replace(routes.home)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.badges}>
        <Badge label={UI_TEXT.badge.module4} />
        <Badge label={`Result #${result.resultInfo.resultId}`} />
        <Badge label={result.caseInfo.caseCode || `Case #${designCaseId}`} />
      </View>

      <Section
        title={UI_TEXT.module4.resultTitle}
        description={UI_TEXT.module4.resultDescription}
      />

      <Card
        title={UI_TEXT.results.inputSummaryTitle}
        description={UI_TEXT.results.inputSummaryDescription}
      >
        <KeyValueList
          items={[
            { label: UI_TEXT.module4Fields.torqueT2, value: `${result.inputSummary.inputT2Nmm.toFixed(2)} Nmm` },
            { label: UI_TEXT.module4Fields.speedN2, value: `${result.inputSummary.inputN2Rpm.toFixed(2)} rpm` },
            { label: UI_TEXT.module4Fields.ratioU3, value: `${result.inputSummary.inputU3.toFixed(2)}` },
          ]}
        />
      </Card>

      <SpurGeometryCard geometry={result.spurGearGeometry} />

      <DerivedFactorsCard factors={result.derivedFactors} />

      <SpurStressCheckCard
        stress={result.stressCheck}
        input={result.inputSummary}
      />

      <ShaftForcesCard forces={result.shaftForces} />

      <Card
        title={UI_TEXT.results.notesTitle}
        description={UI_TEXT.results.notesDescription}
      >
        {result.calculationNotes.map((note, i) => (
          <Text key={i} variant="body" tone="secondary">- {note}</Text>
        ))}
      </Card>

      <View style={styles.actions}>
        <Button
          label={UI_TEXT.actions.backToHome}
          onPress={() => router.replace(routes.home)}
        />
        <Button
          label={UI_TEXT.actions.calculationHistory}
          onPress={() => router.push(routes.calculationsHistory)}
          variant="secondary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    gap: appTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  actions: {
    gap: appTheme.spacing.sm,
    marginTop: appTheme.spacing.md,
  },
});
