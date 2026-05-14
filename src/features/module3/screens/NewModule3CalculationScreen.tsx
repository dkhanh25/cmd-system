import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InlineError } from '@/components/ui/InlineError';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { Section } from '@/components/ui/Section';
import { routes } from '@/constants/routes';
import { UI_TEXT } from '@/constants/uiText';
import { useModule3Calculation } from '@/features/module3/hooks/useModule3Calculation';
import { MaterialSelectionCard } from '@/features/module3/components/MaterialSelectionCard';
import { appTheme } from '@/theme';

export function NewModule3CalculationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ designCaseId: string }>();
  const designCaseId = Number(params.designCaseId);

  const [materialId, setMaterialId] = useState<number | null>(null);
  const [inputT1, setInputT1] = useState('');
  const [inputN1, setInputN1] = useState('');
  const [inputU2, setInputU2] = useState('');
  const [lifeHours, setLifeHours] = useState('');

  const {
    bootstrapData,
    bootstrapError,
    isBootstrapping,
    isSubmitting,
    submissionError,
    loadBootstrapData,
    submitCalculation,
  } = useModule3Calculation();

  useEffect(() => {
    loadBootstrapData();
  }, [loadBootstrapData]);

  async function handleSubmit() {
    if (!materialId || isNaN(designCaseId)) return;

    const result = await submitCalculation({
      designCaseId,
      materialId,
      inputT1Nmm: inputT1 ? Number(inputT1) : undefined,
      inputN1Rpm: inputN1 ? Number(inputN1) : undefined,
      inputU2: inputU2 ? Number(inputU2) : undefined,
      serviceLifeHours: lifeHours ? Number(lifeHours) : undefined,
    });

    if (result.result) {
      router.push({
        pathname: routes.module3Result as any,
        params: { designCaseId: designCaseId.toString() },
      });
    }
  }

  if (isBootstrapping) {
    return (
      <ScreenContainer>
        <LoadingState
          title={UI_TEXT.newCalculation.bootstrapLoadingTitle}
          description={UI_TEXT.newCalculation.bootstrapLoadingDescription}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.badges}>
        <Badge label={UI_TEXT.badge.module3} />
        <Badge label={UI_TEXT.badge.calculator} />
        {designCaseId ? <Badge label={`Case #${designCaseId}`} /> : null}
      </View>

      <Section
        title={UI_TEXT.module3.newTitle}
        description={UI_TEXT.module3.newDescription}
      />

      {bootstrapError ? <InlineError message={bootstrapError} /> : null}

      <MaterialSelectionCard
        materials={bootstrapData.materials}
        selectedId={materialId}
        onSelect={setMaterialId}
      />

      <Card
        title={UI_TEXT.module3.inputOverridesTitle}
        description={UI_TEXT.module3.inputOverridesDescription}
      >
        <Input
          label={UI_TEXT.module3Fields.torqueT1}
          value={inputT1}
          onChangeText={setInputT1}
          keyboardType="decimal-pad"
          unit="Nmm"
          placeholder="Optional"
        />
        <Input
          label={UI_TEXT.module3Fields.speedN1}
          value={inputN1}
          onChangeText={setInputN1}
          keyboardType="decimal-pad"
          unit="rpm"
          placeholder="Optional"
        />
        <Input
          label={UI_TEXT.module3Fields.ratioU2}
          value={inputU2}
          onChangeText={setInputU2}
          keyboardType="decimal-pad"
          placeholder="Optional"
        />
        <Input
          label={UI_TEXT.module3Fields.lifeHours}
          value={lifeHours}
          onChangeText={setLifeHours}
          keyboardType="decimal-pad"
          unit="h"
          placeholder="Optional"
        />
      </Card>

      {submissionError ? <InlineError message={submissionError} /> : null}

      <View style={styles.actions}>
        <Button
          label={UI_TEXT.actions.calculate}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={!materialId || isSubmitting}
        />
        <Button
          label={UI_TEXT.actions.backToHome}
          onPress={() => router.replace(routes.home)}
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
