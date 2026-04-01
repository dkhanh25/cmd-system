import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { ACTIVE_MODULE, APP_NAME } from '@/constants/app';
import { routes } from '@/constants/routes';
import { UI_TEXT } from '@/constants/uiText';
import { useModule1HistoryStore } from '@/features/module1/state/module1HistoryStore';
import { formatDateTime, formatPowerKw, formatRpm } from '@/features/module1/utils/formatters';
import { appTheme } from '@/theme';

export function HomeScreen() {
  const router = useRouter();
  const { entries } = useModule1HistoryStore();
  const latestEntry = entries[0];

  return (
    <ScreenContainer>
      <View style={styles.badges}>
        <Badge label={ACTIVE_MODULE} />
        <Badge label={UI_TEXT.badge.calculator} />
      </View>

      <Section
        title={APP_NAME}
        description={UI_TEXT.home.description}
      />

      <Card
        title={UI_TEXT.home.moduleScopeTitle}
        description={UI_TEXT.home.moduleScopeDescription}>
        <Text variant="body">- {UI_TEXT.home.moduleScopeBullets[0]}</Text>
        <Text variant="body">- {UI_TEXT.home.moduleScopeBullets[1]}</Text>
        <Text variant="body">- {UI_TEXT.home.moduleScopeBullets[2]}</Text>
      </Card>

      <Card
        title={UI_TEXT.home.getStartedTitle}
        description={UI_TEXT.home.getStartedDescription}>
        <View style={styles.actions}>
          <Button
            label={UI_TEXT.actions.newCalculation}
            onPress={() => router.push(routes.calculationsNew)}
          />
          <Button
            label={UI_TEXT.actions.calculationHistory}
            onPress={() => router.push(routes.calculationsHistory)}
            variant="secondary"
          />
          <Button
            label={UI_TEXT.actions.settings}
            onPress={() => router.push(routes.settings)}
            variant="secondary"
          />
        </View>
      </Card>

      {latestEntry ? (
        <Card
          title={UI_TEXT.home.recentCalculationTitle}
          description={UI_TEXT.home.recentCalculationDescription}>
          <KeyValueList
            items={[
              {
                label: UI_TEXT.results.selectedMotorTitle,
                value: latestEntry.result.selectedMotor.code,
                valueVariant: 'bodySmallStrong',
              },
              {
                label: UI_TEXT.fields.powerLabel,
                value: formatPowerKw(latestEntry.result.inputEcho.powerKw),
              },
              {
                label: UI_TEXT.fields.outputSpeedLabel,
                value: formatRpm(latestEntry.result.inputEcho.outputRpm),
              },
              {
                label: UI_TEXT.history.saved,
                value: formatDateTime(latestEntry.createdAt),
                valueVariant: 'bodySmallStrong',
              },
            ]}
          />
        </Card>
      ) : null}

      <Card
        title={UI_TEXT.home.overviewTitle}
        description={UI_TEXT.home.overviewDescription}
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
  actions: {
    gap: appTheme.spacing.sm,
  },
});
