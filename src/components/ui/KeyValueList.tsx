/**
 * Shared helper for rendering compact groups of labeled result rows.
 */

import { StyleSheet, View } from 'react-native';

import { appTheme } from '@/theme';
import { ResultRow } from './ResultRow';

type KeyValueItem = {
  label: string;
  value: string;
};

type KeyValueListProps = {
  items: KeyValueItem[];
};

export function KeyValueList({ items }: KeyValueListProps) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <ResultRow key={item.label} label={item.label} value={item.value} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: appTheme.spacing.xs,
  },
});
