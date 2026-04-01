/**
 * Shared button primitive for primary and secondary call-to-action states.
 */

import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { appTheme } from '@/theme';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  disabled?: boolean;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const shouldDisable = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={shouldDisable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        shouldDisable ? styles.disabledButton : null,
        pressed && !shouldDisable ? styles.pressedButton : null,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? appTheme.colors.surface : appTheme.colors.accent} />
      ) : (
        <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: appTheme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: appTheme.spacing.md,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: appTheme.colors.accent,
    borderColor: appTheme.colors.accent,
  },
  secondaryButton: {
    backgroundColor: appTheme.colors.surface,
    borderColor: appTheme.colors.border,
  },
  disabledButton: {
    backgroundColor: appTheme.colors.disabled,
    borderColor: appTheme.colors.disabled,
  },
  pressedButton: {
    opacity: 0.92,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  primaryLabel: {
    color: appTheme.colors.surface,
  },
  secondaryLabel: {
    color: appTheme.colors.accent,
  },
});
