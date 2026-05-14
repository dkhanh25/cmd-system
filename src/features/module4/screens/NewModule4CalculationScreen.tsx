import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InlineError } from '@/components/ui/InlineError';
import { Input } from '@/components/ui/Input';
import { Section } from '@/components/ui/Section';
import { routes } from '@/constants/routes';
import { UI_TEXT } from '@/constants/uiText';
import { useModule4Calculation } from '@/features/module4/hooks/useModule4Calculation';
import { appTheme } from '@/theme';

export function NewModule4CalculationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ designCaseId: string }>();
  const designCaseId = Number(params.designCaseId);

  const [inputT2, setInputT2] = useState('');
  const [inputN2, setInputN2] = useState('');
  const [inputU3, setInputU3] = useState('');
  const [sigmaH, setSigmaH] = useState('');
  const [sigmaF1, setSigmaF1] = useState('');
  const [sigmaF2, setSigmaF2] = useState('');

  const {
    isSubmitting,
    submissionError,
    submitCalculation,
  } = useModule4Calculation();

  async function handleSubmit() {
    if (isNaN(designCaseId)) return;

    const result = await submitCalculation({
      designCaseId,
      inputT2Nmm: inputT2 ? Number(inputT2) : undefined,
      inputN2Rpm: inputN2 ? Number(inputN2) : undefined,
      inputU3: inputU3 ? Number(inputU3) : undefined,
      allowableContactStressMpa: sigmaH ? Number(sigmaH) : undefined,
      allowableBendingStressGear1Mpa: sigmaF1 ? Number(sigmaF1) : undefined,
      allowableBendingStressGear2Mpa: sigmaF2 ? Number(sigmaF2) : undefined,
    });

    if (result.result) {
      router.push({
        pathname: routes.module4Result as any,
        params: { designCaseId: designCaseId.toString() },
      });
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.badges}>
        <Badge label={UI_TEXT.badge.module4} />
        <Badge label={UI_TEXT.badge.calculator} />
        {designCaseId ? <Badge label={`Case #${designCaseId}`} /> : null}
      </View>

      <Section
        title={UI_TEXT.module4.newTitle}
        description={UI_TEXT.module4.newDescription}
      />

      <Card
        title={UI_TEXT.module3.inputOverridesTitle}
        description="Optionally override values inherited from Module 1."
      >
        <Input
          label={UI_TEXT.module4Fields.torqueT2}
          value={inputT2}
          onChangeText={setInputT2}
          keyboardType="decimal-pad"
          unit="Nmm"
          placeholder="Optional"
        />
        <Input
          label={UI_TEXT.module4Fields.speedN2}
          value={inputN2}
          onChangeText={setInputN2}
          keyboardType="decimal-pad"
          unit="rpm"
          placeholder="Optional"
        />
        <Input
          label={UI_TEXT.module4Fields.ratioU3}
          value={inputU3}
          onChangeText={setInputU3}
          keyboardType="decimal-pad"
          placeholder="Optional"
        />
      </Card>

      <Card
        title="Allowable Stress Overrides"
        description="Optionally override stress limits."
      >
        <Input
          label={UI_TEXT.module4Fields.allowableContact}
          value={sigmaH}
          onChangeText={setSigmaH}
          keyboardType="decimal-pad"
          unit="MPa"
          placeholder="Optional"
        />
        <Input
          label={UI_TEXT.module4Fields.allowableBending1}
          value={sigmaF1}
          onChangeText={setSigmaF1}
          keyboardType="decimal-pad"
          unit="MPa"
          placeholder="Optional"
        />
        <Input
          label={UI_TEXT.module4Fields.allowableBending2}
          value={sigmaF2}
          onChangeText={setSigmaF2}
          keyboardType="decimal-pad"
          unit="MPa"
          placeholder="Optional"
        />
      </Card>

      {submissionError ? <InlineError message={submissionError} /> : null}

      <View style={styles.actions}>
        <Button
          label={UI_TEXT.actions.calculate}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
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
