import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InlineError } from '@/components/ui/InlineError';
import { Input } from '@/components/ui/Input';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { LoadingState } from '@/components/ui/LoadingState';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { routes } from '@/constants/routes';
import { UI_TEXT } from '@/constants/uiText';
import { useModule1Calculation } from '@/features/module1/hooks/useModule1Calculation';
import { addModule1HistoryEntry } from '@/features/module1/state/module1HistoryStore';
import { formatRatio } from '@/features/module1/utils/formatters';
import {
  buildModule1CalculationRequest,
  mapApiFieldErrorsToFormErrors,
  type Module1FormErrors,
  validateModule1Form,
} from '@/features/module1/utils/module1Validation';
import { appTheme } from '@/theme';

type SubmissionState = 'idle' | 'submitting' | 'error';

export function NewCalculationScreen() {
  const router = useRouter();
  const [powerKw, setPowerKw] = useState('');
  const [outputRpm, setOutputRpm] = useState('');
  const [formErrors, setFormErrors] = useState<Module1FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const {
    bootstrapData,
    bootstrapError,
    isBootstrapping,
    isSubmitting,
    submissionError,
    submissionApiError,
    loadBootstrapData,
    submitCalculation,
  } = useModule1Calculation();

  useEffect(() => {
    loadBootstrapData();
  }, [loadBootstrapData]);

  async function handleSubmit() {
    const nextErrors = validateModule1Form({ powerKw, outputRpm });
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmissionState('error');
      return;
    }

    setSubmissionState('submitting');
    const submission = await submitCalculation(
      buildModule1CalculationRequest({ powerKw, outputRpm }),
    );

    if (submission.result) {
      const historyEntry = addModule1HistoryEntry(submission.result);
      router.push({
        pathname: routes.calculationsResult,
        params: {
          requestId: historyEntry.id,
        },
      });
      return;
    }

    if (submission.apiError?.error.fieldErrors) {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        ...mapApiFieldErrorsToFormErrors(submission.apiError?.error.fieldErrors),
      }));
    }

    if (submission.message || submissionError || submissionApiError) {
      setSubmissionState('error');
    }
  }

  function handleReset() {
    setPowerKw('');
    setOutputRpm('');
    setFormErrors({});
    setSubmissionState('idle');
  }

  return (
    <ScreenContainer>
      <View style={styles.badges}>
        <Badge label={UI_TEXT.badge.module1} />
        <Badge label={UI_TEXT.badge.calculator} />
      </View>

      <Section
        title={UI_TEXT.newCalculation.title}
        description={UI_TEXT.newCalculation.description}
      />

      <View style={styles.formArea}>
        <Card
          title={UI_TEXT.newCalculation.referenceValuesTitle}
          description={UI_TEXT.newCalculation.referenceValuesDescription}>
          {isBootstrapping ? (
            <LoadingState
              title={UI_TEXT.newCalculation.bootstrapLoadingTitle}
              description={UI_TEXT.newCalculation.bootstrapLoadingDescription}
            />
          ) : bootstrapError ? (
            <InlineError message={bootstrapError} />
          ) : bootstrapData.constants ? (
            <KeyValueList
              items={[
                {
                  label: UI_TEXT.fields.availableMotors,
                  value: `${bootstrapData.motors.length}`,
                  valueVariant: 'bodySmallStrong',
                },
                {
                  label: UI_TEXT.fields.defaultBeltRatio,
                  value: formatRatio(bootstrapData.constants.defaultBeltRatioUd),
                },
                {
                  label: UI_TEXT.fields.defaultGearRatio,
                  value: formatRatio(bootstrapData.constants.defaultGearboxRatioUhPreview),
                },
                {
                  label: UI_TEXT.fields.efficiencyD,
                  value: formatRatio(bootstrapData.constants.etaD),
                },
              ]}
            />
          ) : null}
        </Card>

        <Card
          title={UI_TEXT.newCalculation.requiredInputsTitle}
          description={UI_TEXT.newCalculation.requiredInputsDescription}>
          <Input
            keyboardType="decimal-pad"
            label={UI_TEXT.fields.powerLabel}
            value={powerKw}
            onChangeText={setPowerKw}
            placeholder={UI_TEXT.fields.powerPlaceholder}
            unit="kW"
            helperText={UI_TEXT.fields.powerHelper}
            errorText={formErrors.powerKw}
          />

          <Input
            keyboardType="decimal-pad"
            label={UI_TEXT.fields.outputSpeedLabel}
            value={outputRpm}
            onChangeText={setOutputRpm}
            placeholder={UI_TEXT.fields.outputSpeedPlaceholder}
            unit="rpm"
            helperText={UI_TEXT.fields.outputSpeedHelper}
            errorText={formErrors.outputRpm}
          />

          {submissionState === 'error' && submissionError ? (
            <InlineError message={submissionError} />
          ) : null}
        </Card>

        <Card
          title={UI_TEXT.newCalculation.calculationFlowTitle}
          description={UI_TEXT.newCalculation.calculationFlowDescription}>
          <Text variant="body">- {UI_TEXT.newCalculation.calculationFlowBullets[0]}</Text>
          <Text variant="body">- {UI_TEXT.newCalculation.calculationFlowBullets[1]}</Text>
          <Text variant="body">- {UI_TEXT.newCalculation.calculationFlowBullets[2]}</Text>
          <Text variant="body">- {UI_TEXT.newCalculation.calculationFlowBullets[3]}</Text>
        </Card>

        <View style={styles.actions}>
          <Button
            label={UI_TEXT.actions.calculate}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
          <Button
            label={UI_TEXT.actions.clearInputs}
            onPress={handleReset}
            variant="secondary"
          />
        </View>

        {isSubmitting ? (
          <View pointerEvents="none" style={styles.overlay}>
            <LoadingState
              title={UI_TEXT.newCalculation.loadingTitle}
              description={UI_TEXT.newCalculation.loadingDescription}
            />
          </View>
        ) : null}
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
  formArea: {
    position: 'relative',
    gap: appTheme.spacing.lg,
  },
  actions: {
    gap: appTheme.spacing.sm,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    padding: appTheme.spacing.md,
    backgroundColor: appTheme.colors.overlay,
    borderRadius: appTheme.radii.xl,
  },
});
