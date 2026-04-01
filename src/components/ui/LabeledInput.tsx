/**
 * Shared labeled text input with helper text, unit suffix, and inline validation support.
 */

import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { appTheme } from '@/theme';

type LabeledInputProps = TextInputProps & {
  label: string;
  helperText?: string;
  errorText?: string;
  unit?: string;
};

export function LabeledInput({
  label,
  helperText,
  errorText,
  unit,
  ...inputProps
}: LabeledInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputShell, errorText ? styles.inputShellError : null]}>
        <TextInput
          placeholderTextColor={appTheme.colors.textMuted}
          style={styles.input}
          {...inputProps}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: appTheme.spacing.xs,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: appTheme.colors.textPrimary,
  },
  inputShell: {
    minHeight: 52,
    borderRadius: appTheme.radii.md,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: appTheme.spacing.sm,
    gap: appTheme.spacing.sm,
  },
  inputShellError: {
    borderColor: appTheme.colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: appTheme.colors.textPrimary,
    paddingVertical: appTheme.spacing.sm,
  },
  unit: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: appTheme.colors.textSecondary,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: appTheme.colors.textSecondary,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: appTheme.colors.danger,
  },
});
