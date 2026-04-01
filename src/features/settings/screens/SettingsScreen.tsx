/**
 * Placeholder settings screen for future configuration, units, and environment toggles.
 */

import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { KeyValueList } from '@/components/ui/KeyValueList';
import { SectionCard } from '@/components/ui/SectionCard';
import { ACTIVE_MODULE, APP_NAME } from '@/constants/app';
import { appTheme } from '@/theme';

export function SettingsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        Keep this screen simple for now. It documents app scope and reserves space for future user
        preferences without introducing auth or advanced configuration too early.
      </Text>

      <SectionCard title="App Information">
        <KeyValueList
          items={[
            { label: 'App name', value: APP_NAME },
            { label: 'Active scope', value: ACTIVE_MODULE },
            { label: 'Current app mode', value: 'Mock API integration' },
            { label: 'Current data source', value: 'In-app mock service layer' },
            { label: 'Contract source', value: 'docs/API_DESIGN_MODULE_1.md' },
          ]}
        />
      </SectionCard>

      <SectionCard title="Future Preferences">
        <KeyValueList
          items={[
            { label: 'Units', value: 'Reserved for future selection' },
            { label: 'Numeric formatting', value: 'Reserved for future rounding preferences' },
            { label: 'Environment flags', value: 'Reserved for development-only controls' },
          ]}
        />
      </SectionCard>

      <SectionCard
        title="Current Constraints"
        description="No authentication, remote backend integration, or advanced settings are included at this stage." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: appTheme.colors.textPrimary,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: appTheme.colors.textSecondary,
  },
});
