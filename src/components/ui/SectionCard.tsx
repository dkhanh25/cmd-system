/**
 * Shared content card used to group related content blocks in the app skeleton.
 */

import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '@/theme';

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  footer?: ReactNode;
}>;

export function SectionCard({
  title,
  description,
  footer,
  children,
}: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      {children ? <View style={styles.body}>{children}</View> : null}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: appTheme.spacing.md,
    borderRadius: appTheme.radii.lg,
    padding: appTheme.spacing.md,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  header: {
    gap: appTheme.spacing.xs,
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
  body: {
    gap: appTheme.spacing.sm,
  },
  footer: {
    paddingTop: appTheme.spacing.xs,
  },
});
