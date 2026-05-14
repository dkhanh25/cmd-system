import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { Badge } from '@/components/ui/Badge';
import { UI_TEXT } from '@/constants/uiText';
import { appTheme } from '@/theme';
import type { Module3CalculationResponseDto } from '@/types/api/module3';

type Props = {
  stress: Module3CalculationResponseDto['stressCheck'];
  allowable: Module3CalculationResponseDto['allowableStresses'];
};

export function StressCheckCard({ stress, allowable }: Props) {
  return (
    <Card
      title={UI_TEXT.module3.stressesTitle}
      description={UI_TEXT.module3.stressesDescription}
    >
      <View style={styles.row}>
        <View style={styles.flex}>
          <KeyValueList
            items={[
              { label: UI_TEXT.module3Fields.contactStress, value: `${stress.sigmaHMpa.toFixed(2)} MPa` },
              { label: UI_TEXT.module3Fields.allowableContact, value: `${allowable.allowableContactStressMpa.toFixed(2)} MPa` },
            ]}
          />
        </View>
        <Badge
          label={stress.contactStressPass ? UI_TEXT.module3Fields.pass : UI_TEXT.module3Fields.fail}
          tone={stress.contactStressPass ? 'info' : 'warning'}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.flex}>
          <KeyValueList
            items={[
              { label: UI_TEXT.module3Fields.bendingStress1, value: `${stress.sigmaF1Mpa.toFixed(2)} MPa` },
              { label: UI_TEXT.module3Fields.bendingStress2, value: `${stress.sigmaF2Mpa.toFixed(2)} MPa` },
              { label: UI_TEXT.module3Fields.allowableBending, value: `${allowable.allowableBendingStressMpa.toFixed(2)} MPa` },
            ]}
          />
        </View>
        <Badge
          label={stress.bendingStressPass ? UI_TEXT.module3Fields.pass : UI_TEXT.module3Fields.fail}
          tone={stress.bendingStressPass ? 'info' : 'warning'}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: appTheme.colors.border,
    marginVertical: appTheme.spacing.sm,
  },
});
