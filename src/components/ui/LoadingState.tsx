/**
 * Shared loading state used while screens prepare data or simulate submission.
 */

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { appTheme } from '@/theme';

type LoadingStateProps = {
  title: string;
  description?: string;
};

export function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={appTheme.colors.accent} size="small" />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: appTheme.radii.lg,
    padding: appTheme.spacing.lg,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: appTheme.spacing.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: appTheme.colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: appTheme.colors.textSecondary,
    textAlign: 'center',
  },
});
