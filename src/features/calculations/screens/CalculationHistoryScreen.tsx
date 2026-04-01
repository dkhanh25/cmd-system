/**
 * Temporary FE-only history screen backed by a lightweight in-memory Module 1 store.
 */

import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { SectionCard } from '@/components/ui/SectionCard';
import { useModule1HistoryStore } from '@/features/module1/state/module1HistoryStore';
import { formatDateTime, formatPowerKw, formatRpm } from '@/features/module1/utils/module1Formatters';
import { routes } from '@/constants/routes';
import { appTheme } from '@/theme';

export function CalculationHistoryScreen() {
  const router = useRouter();
  const { entries } = useModule1HistoryStore();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Saved Calculations</Text>
      <Text style={styles.description}>
        Successful Module 1 calculations are currently stored in a lightweight in-memory store so
        the app is demoable before real persistence is added.
      </Text>

      {entries.length === 0 ? (
        <EmptyState
          title="No saved calculations yet"
          description="Run a Module 1 calculation first. Successful responses are added here automatically."
          actionLabel="Start First Calculation"
          onAction={() => router.push(routes.calculationsNew)}
        />
      ) : (
        <View style={styles.list}>
          {entries.map((entry) => (
            <SectionCard
              key={entry.id}
              title={entry.title}
              description={entry.summary}
              footer={
                <AppButton
                  label="Open Result"
                  onPress={() =>
                    router.push({
                      pathname: routes.calculationsResult,
                      params: { requestId: entry.id },
                    })
                  }
                  variant="secondary"
                />
              }>
              <KeyValueList
                items={[
                  { label: 'Saved at', value: formatDateTime(entry.createdAt) },
                  { label: 'Power', value: formatPowerKw(entry.result.inputEcho.powerKw) },
                  { label: 'Output speed', value: formatRpm(entry.result.inputEcho.outputRpm) },
                  {
                    label: 'Selected motor',
                    value: `${entry.result.selectedMotor.code} / ${formatPowerKw(entry.result.selectedMotor.ratedPowerKw)}`,
                  },
                ]}
              />
            </SectionCard>
          ))}
        </View>
      )}

      <SectionCard
        title="Saved Item Layout Preview"
        description="This temporary history shape is intentionally compact so it can be replaced later by persisted or backend-provided summaries.">
        <KeyValueList
          items={[
            { label: 'Current mode', value: 'In-memory temporary store' },
            { label: 'Result lookup', value: 'By request id' },
            { label: 'Persistence', value: 'Planned later' },
          ]}
        />
      </SectionCard>

      <AppButton
        label="Back to Home"
        onPress={() => router.replace(routes.home)}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  list: {
    gap: appTheme.spacing.md,
  },
});
