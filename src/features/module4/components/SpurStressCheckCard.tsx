import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { Badge } from '@/components/ui/Badge';
import { UI_TEXT } from '@/constants/uiText';
import { appTheme } from '@/theme';
import type { Module4CalculationResponseDto } from '@/types/api/module4';

type Props = {
  stress: Module4CalculationResponseDto['stressCheck'];
  input: Module4CalculationResponseDto['inputSummary'];
};

export function SpurStressCheckCard({ stress, input }: Props) {
  return (
    <Card
      title={UI_TEXT.module4.stressesTitle}
      description={UI_TEXT.module4.stressesDescription}
    >
      <View style={styles.row}>
        <View style={styles.flex}>
          <KeyValueList
            items={[
              { label: UI_TEXT.module3Fields.contactStress, value: `${stress.sigmaHMpa.toFixed(2)} MPa` },
              { label: UI_TEXT.module3Fields.allowableContact, value: `${input.allowableContactStressMpa.toFixed(2)} MPa` },
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
              { label: UI_TEXT.module4Fields.bendingStress1, value: `${stress.sigmaF1Mpa.toFixed(2)} MPa` },
              { label: UI_TEXT.module4Fields.bendingStress2, value: `${stress.sigmaF2Mpa.toFixed(2)} MPa` },
              { label: UI_TEXT.module4Fields.allowableBending1, value: `${input.allowableBendingStressGear1Mpa.toFixed(2)} MPa` },
              { label: UI_TEXT.module4Fields.allowableBending2, value: `${input.allowableBendingStressGear2Mpa.toFixed(2)} MPa` },
            ]}
          />
        </View>
        <View style={styles.badgesColumn}>
          <Badge
            label={stress.bendingStressGear1Pass ? `G1 ${UI_TEXT.module3Fields.pass}` : `G1 ${UI_TEXT.module3Fields.fail}`}
            tone={stress.bendingStressGear1Pass ? 'info' : 'warning'}
          />
          <Badge
            label={stress.bendingStressGear2Pass ? `G2 ${UI_TEXT.module3Fields.pass}` : `G2 ${UI_TEXT.module3Fields.fail}`}
            tone={stress.bendingStressGear2Pass ? 'info' : 'warning'}
          />
        </View>
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
  badgesColumn: {
    gap: appTheme.spacing.xs,
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: appTheme.colors.border,
    marginVertical: appTheme.spacing.sm,
  },
});
