/**
 * Module 1 form screen wired to the mock API and temporary FE-only history store.
 */

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui/AppButton';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { LoadingState } from '@/components/ui/LoadingState';
import { InlineError } from '@/components/ui/InlineError';
import { LabeledInput } from '@/components/ui/LabeledInput';
import { SectionCard } from '@/components/ui/SectionCard';
import { useModule1Calculation } from '@/features/module1/hooks/useModule1Calculation';
import { addModule1HistoryEntry } from '@/features/module1/state/module1HistoryStore';
import { formatPowerKw, formatRatio } from '@/features/module1/utils/module1Formatters';
import {
  buildModule1CalculationRequest,
  mapApiFieldErrorsToFormErrors,
  type Module1FormErrors,
  validateModule1Form,
} from '@/features/module1/utils/module1Validation';
import { routes } from '@/constants/routes';
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
    setFormErrors({});
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
      <View style={styles.header}>
        <Text style={styles.title}>New Module 1 Calculation</Text>
        <Text style={styles.description}>
          Enter the two required inputs and run the current mock-backed calculation flow. The same
          screen structure will stay in place when real backend integration arrives later.
        </Text>
      </View>

      <SectionCard
        title="Module Defaults"
        description="Reference constants and catalog metadata are loaded from the current mock API layer.">
        {isBootstrapping ? (
          <LoadingState
            title="Loading module defaults"
            description="Fetching constants and catalog information from the mock API."
          />
        ) : bootstrapError ? (
          <InlineError message={bootstrapError} />
        ) : bootstrapData.constants ? (
          <KeyValueList
            items={[
              { label: 'Available motors', value: `${bootstrapData.motors.length}` },
              {
                label: 'Default belt ratio',
                value: formatRatio(bootstrapData.constants.defaultBeltRatioUd),
              },
              {
                label: 'Gearbox preview ratio',
                value: formatRatio(bootstrapData.constants.defaultGearboxRatioUhPreview),
              },
              {
                label: 'Default etaD',
                value: formatRatio(bootstrapData.constants.etaD),
              },
            ]}
          />
        ) : null}
      </SectionCard>

      <SectionCard
        title="Input Parameters"
        description="These fields mirror the current public Module 1 calculation request contract.">
        <LabeledInput
          keyboardType="decimal-pad"
          label="Power on drum shaft"
          value={powerKw}
          onChangeText={setPowerKw}
          placeholder="Enter required power"
          unit="kW"
          helperText="Required. Must be a numeric value greater than 0."
          errorText={formErrors.powerKw}
        />

        <LabeledInput
          keyboardType="decimal-pad"
          label="Output rotational speed"
          value={outputRpm}
          onChangeText={setOutputRpm}
          placeholder="Enter required speed"
          unit="rpm"
          helperText="Required. Must be a numeric value greater than 0."
          errorText={formErrors.outputRpm}
        />

        {submissionState === 'error' && submissionError ? (
          <InlineError message={submissionError} />
        ) : null}
      </SectionCard>

      <SectionCard
        title="Current Demo Flow"
        description="This is already wired to the mock API and temporary FE-only history store.">
        <Text style={styles.noteItem}>- Validate locally before the request runs</Text>
        <Text style={styles.noteItem}>- Submit to the mock Module 1 calculation API</Text>
        <Text style={styles.noteItem}>- Save the response in temporary history</Text>
        <Text style={styles.noteItem}>- Navigate to the result screen by request id</Text>
      </SectionCard>

      <View style={styles.actions}>
        <AppButton
          label="Continue to Result"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
        <AppButton label="Reset Fields" onPress={handleReset} variant="secondary" />
      </View>
    </ScreenContainer>
  );
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
  noteItem: {
    fontSize: 14,
    lineHeight: 20,
    color: appTheme.colors.textPrimary,
  },
  actions: {
    gap: appTheme.spacing.sm,
  },
});
