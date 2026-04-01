/**
 * Small inline error message block for form and screen-level problems.
 */

import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '@/theme';

type InlineErrorProps = {
  message: string;
};

export function InlineError({ message }: InlineErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: appTheme.radii.sm,
    paddingHorizontal: appTheme.spacing.sm,
    paddingVertical: appTheme.spacing.xs,
    backgroundColor: appTheme.colors.dangerSoft,
    borderWidth: 1,
    borderColor: '#F2B8B8',
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: appTheme.colors.danger,
  },
});
