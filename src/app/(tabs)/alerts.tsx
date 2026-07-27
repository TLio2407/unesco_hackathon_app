import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { RiskBadge } from '@/components/risk-badge';
import { useTheme } from '@/hooks/use-theme';
import { PageContainer } from '@/components/page-container';

const MOCK_ALERTS = [
  // ... (keep MOCK_ALERTS as is)
];

type Category = 'All' | 'Scam' | 'Fake Authority' | 'Health';

export default function AlertsScreen() {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');

  const filteredAlerts = MOCK_ALERTS.filter(alert => {
    const matchesCategory = activeCategory === 'All' || alert.category === activeCategory;
    const matchesSearch = alert.title.toLowerCase().includes(search.toLowerCase()) ||
                          alert.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer>
      <ThemedText type="title" style={styles.title}>
        {t('alert.title')}
      </ThemedText>

      <View style={[styles.searchBar, { backgroundColor: theme.surfaceCard, borderColor: theme.cardBorder }]}>
        <Ionicons name="search" size={24} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Tìm kiếm cảnh báo..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['All', 'Scam', 'Fake Authority', 'Health'] as Category[]).map(cat => {
            const isActive = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: isActive ? theme.primaryAction : theme.backgroundElement,
                    borderColor: isActive ? theme.primaryAction : theme.cardBorder,
                  }
                ]}
                onPress={() => setActiveCategory(cat)}>
                <ThemedText style={[
                  styles.filterText,
                  { color: isActive ? theme.primaryActionText : theme.text, fontWeight: isActive ? '700' : '400' }
                ]}>
                  {cat === 'All' ? 'Tất cả' : cat}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.alertsList}>
        {filteredAlerts.map(alert => (
          <ThemedView key={alert.id} type="backgroundElement" style={styles.alertCard}>
            <View style={styles.cardHeader}>
              <RiskBadge level={alert.risk as any} />
              <ThemedText style={[styles.categoryText, { color: theme.textSecondary }]}>{alert.category}</ThemedText>
            </View>
            <ThemedText style={styles.alertTitle}>{alert.title}</ThemedText>
            <ThemedText style={styles.alertSummary}>{alert.summary}</ThemedText>
            <View style={styles.cardFooter}>
              <Ionicons name="newspaper" size={18} color={theme.textSecondary} />
              <ThemedText style={[styles.sourceText, { color: theme.textSecondary }]}>Nguồn: {alert.source}</ThemedText>
            </View>
          </ThemedView>
        ))}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: Accessibility.fontSize.title, marginBottom: Spacing.two },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    height: 56,
    borderWidth: 1,
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: Accessibility.fontSize.normal,
  },
  filterScroll: { marginBottom: Spacing.two },
  filterBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 1,
    marginRight: Spacing.two,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterText: { fontSize: Accessibility.fontSize.normal },
  alertsList: { gap: Spacing.three },
  alertCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryText: { fontSize: Accessibility.fontSize.small, fontStyle: 'italic' },
  alertTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  alertSummary: { fontSize: Accessibility.fontSize.normal, lineHeight: 26 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginTop: Spacing.one },
  sourceText: { fontSize: Accessibility.fontSize.small },
});
