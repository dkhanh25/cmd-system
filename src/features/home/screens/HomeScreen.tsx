/**
 * Bootstrap home screen that orients the user and links into the first feature flows.
 */

import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton } from '@/components/ui/AppButton';
import { SectionCard } from '@/components/ui/SectionCard';
import { ACTIVE_MODULE, APP_NAME } from '@/constants/app';
import { routes } from '@/constants/routes';
import { appTheme } from '@/theme';

export function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{ACTIVE_MODULE}</Text>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.description}>
          Start from a clean Module 1 flow: capture engineering inputs, review grouped results, and
          keep the screen structure ready for mock API integration next.
        </Text>
      </View>

      <SectionCard
        title="Module 1"
        description="Motor selection and transmission ratio distribution are the only business scope for this stage.">
        <Text style={styles.listItem}>- Input required shaft power and output speed</Text>
        <Text style={styles.listItem}>- Review selected motor and transmission ratios</Text>
        <Text style={styles.listItem}>- Inspect grouped shaft characteristics</Text>
      </SectionCard>

      <SectionCard
        title="Get Started"
        description="The buttons below map directly to the primary navigation destinations we need at this stage.">
        <View style={styles.actions}>
          <AppButton
            label="Start Module 1 Calculation"
            onPress={() => router.push(routes.calculationsNew)}
          />
          <AppButton
            label="Open Saved Calculations"
            onPress={() => router.push(routes.calculationsHistory)}
            variant="secondary"
          />
          <AppButton
            label="Open Settings"
            onPress={() => router.push(routes.settings)}
            variant="secondary"
          />
        </View>
      </SectionCard>

      <SectionCard
        title="Next Integration Step"
        description="This skeleton intentionally stops before real data wiring. The next task can plug the Module 1 mock API into the same screens without changing the route structure." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: appTheme.spacing.sm,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: appTheme.colors.accent,
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: appTheme.colors.textPrimary,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: appTheme.colors.textSecondary,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: appTheme.colors.textPrimary,
  },
  actions: {
    gap: appTheme.spacing.sm,
  },
});
