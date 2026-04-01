/**
 * Root Expo Router layout that owns the app-wide stack and screen chrome.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { appTheme } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: appTheme.colors.surface,
          },
          headerTintColor: appTheme.colors.textPrimary,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: appTheme.colors.background,
          },
        }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="calculations/new" options={{ title: 'New Calculation' }} />
        <Stack.Screen name="calculations/result" options={{ title: 'Calculation Result' }} />
        <Stack.Screen name="calculations/history" options={{ title: 'Saved Calculations' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </>
  );
}
