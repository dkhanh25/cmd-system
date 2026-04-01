import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { Section } from '@/components/ui/Section';
import { routes } from '@/constants/routes';
import { UI_TEXT } from '@/constants/uiText';
import { useModule1HistoryStore } from '@/features/module1/state/module1HistoryStore';
import { formatDateTime, formatPowerKw, formatRpm } from '@/features/module1/utils/formatters';
import { appTheme } from '@/theme';

export function CalculationHistoryScreen() {
  const router = useRouter();
  const { entries } = useModule1HistoryStore();

  return (
    <ScreenContainer>
      <View style={styles.badges}>
        <Badge label={UI_TEXT.badge.module1} />
        <Badge label={UI_TEXT.badge.history} />
      </View>

      <Section
        title={UI_TEXT.history.title}
        description={UI_TEXT.history.description}
      />

      {entries.length === 0 ? (
        <EmptyState
          title={UI_TEXT.history.emptyTitle}
          description={UI_TEXT.history.emptyDescription}
          actionLabel={UI_TEXT.actions.newCalculation}
          onAction={() => router.push(routes.calculationsNew)}
        />
      ) : (
        <View style={styles.list}>
          {entries.map((entry) => (
            <Card
              key={entry.id}
              title={entry.title}
              description={entry.summary}
              footer={
                <Button
                  label={UI_TEXT.actions.viewResults}
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
                  {
                    label: UI_TEXT.history.saved,
                    value: formatDateTime(entry.createdAt),
                    valueVariant: 'bodySmallStrong',
                  },
                  { label: UI_TEXT.fields.powerLabel, value: formatPowerKw(entry.result.inputEcho.powerKw) },
                  {
                    label: UI_TEXT.fields.outputSpeedLabel,
                    value: formatRpm(entry.result.inputEcho.outputRpm),
                  },
                  {
                    label: UI_TEXT.results.selectedMotorTitle,
                    value: entry.result.selectedMotor.code,
                    valueVariant: 'bodySmallStrong',
                  },
                ]}
              />
            </Card>
          ))}
        </View>
      )}

      <Card
        title={UI_TEXT.history.detailsTitle}
        description={UI_TEXT.history.detailsDescription}>
        <KeyValueList
          items={[
            {
              label: UI_TEXT.history.savedIn,
              value: UI_TEXT.history.savedInValue,
              valueVariant: 'bodySmallStrong',
            },
            {
              label: UI_TEXT.history.reference,
              value: UI_TEXT.history.referenceValue,
              valueVariant: 'bodySmallStrong',
            },
            {
              label: UI_TEXT.history.availability,
              value: UI_TEXT.history.availabilityValue,
              valueVariant: 'bodySmallStrong',
            },
          ]}
        />
      </Card>

      <Button
        label={UI_TEXT.actions.backToHome}
        onPress={() => router.replace(routes.home)}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    gap: appTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  list: {
    gap: appTheme.spacing.sm,
  },
});
