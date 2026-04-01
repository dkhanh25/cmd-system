/**
 * Shared empty state for screens that have no current data to display.
 */

import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '@/theme';
import { AppButton } from './AppButton';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <AppButton label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: appTheme.radii.lg,
    padding: appTheme.spacing.lg,
    backgroundColor: appTheme.colors.surfaceMuted,
    gap: appTheme.spacing.sm,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: appTheme.colors.textPrimary,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: appTheme.colors.textSecondary,
  },
  action: {
    paddingTop: appTheme.spacing.xs,
  },
});
