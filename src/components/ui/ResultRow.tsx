/**
 * Simple labeled row for rendering read-only result values and summaries.
 */

import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '@/theme';

type ResultRowProps = {
  label: string;
  value: string;
};

export function ResultRow({ label, value }: ResultRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: appTheme.spacing.sm,
    paddingVertical: appTheme.spacing.xs,
  },
  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: appTheme.colors.textSecondary,
  },
  value: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: appTheme.colors.textPrimary,
    textAlign: 'right',
  },
});
