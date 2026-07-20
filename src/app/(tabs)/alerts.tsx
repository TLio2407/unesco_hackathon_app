import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { RiskBadge } from '@/components/risk-badge';

const MOCK_ALERTS = [
  {
    id: 1,
    title: 'Giả mạo Công an gọi điện đe dọa',
    category: 'Fake Authority',
    risk: 'high_risk',
    summary: 'Đối tượng gọi điện tự xưng là công an, thông báo người dân liên quan đến vụ án ma túy và yêu cầu chuyển tiền vào tài khoản "tạm giữ".',
    source: 'Bộ Công an',
  },
  {
    id: 2,
    title: 'Lừa đảo tuyển CTV "Việc nhẹ lương cao"',
    category: 'Scam',
    risk: 'high_risk',
    summary: 'Mời chào tham gia làm CTV chốt đơn Shopee, Lazada để nhận hoa hồng, sau đó yêu cầu nạp số tiền lớn và chiếm đoạt.',
    source: 'Cục An toàn thông tin',
  },
  {
    id: 3,
    title: 'Tin giả về "Thuốc thần" trị bách bệnh',
    category: 'Health',
    risk: 'caution',
    summary: 'Các quảng cáo trên Facebook sử dụng logo đài truyền hình để thổi phồng công dụng của thực phẩm chức năng.',
    source: 'Bộ Y tế',
  },
  {
    id: 4,
    title: 'Cảnh báo link lạ giả mạo VNeID',
    category: 'Fake Authority',
    risk: 'high_risk',
    summary: 'Tin nhắn SMS yêu cầu cập nhật VNeID mức độ 2 qua một đường link lạ (.apk) để cài mã độc vào điện thoại.',
    source: 'Cổng thông tin Chính phủ',
  },
];

type Category = 'All' | 'Scam' | 'Fake Authority' | 'Health';

export default function AlertsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');

  const filteredAlerts = MOCK_ALERTS.filter(alert => {
    const matchesCategory = activeCategory === 'All' || alert.category === activeCategory;
    const matchesSearch = alert.title.toLowerCase().includes(search.toLowerCase()) ||
                          alert.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {t('alert.title')}
          </ThemedText>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color={Accessibility.colors.calmTextSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm cảnh báo..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={Accessibility.colors.calmTextSecondary}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {(['All', 'Scam', 'Fake Authority', 'Health'] as Category[]).map(cat => (
              <Pressable
                key={cat}
                style={[styles.filterBtn, activeCategory === cat && styles.filterBtnActive]}
                onPress={() => setActiveCategory(cat)}>
                <ThemedText style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>
                  {cat === 'All' ? 'Tất cả' : cat}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.alertsList}>
            {filteredAlerts.map(alert => (
              <ThemedView key={alert.id} type="backgroundElement" style={styles.alertCard}>
                <View style={styles.cardHeader}>
                  <RiskBadge level={alert.risk as any} />
                  <ThemedText style={styles.categoryText}>{alert.category}</ThemedText>
                </View>
                <ThemedText style={styles.alertTitle}>{alert.title}</ThemedText>
                <ThemedText style={styles.alertSummary}>{alert.summary}</ThemedText>
                <View style={styles.cardFooter}>
                  <Ionicons name="newspaper" size={18} color={Accessibility.colors.calmTextSecondary} />
                  <ThemedText style={styles.sourceText}>Nguồn: {alert.source}</ThemedText>
                </View>
              </ThemedView>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  title: { fontSize: Accessibility.fontSize.title },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Accessibility.colors.surfaceCard,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    height: 56,
    borderWidth: 1,
    borderColor: '#DDD',
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: Accessibility.fontSize.normal,
    color: Accessibility.colors.calmText,
  },
  filterScroll: { marginBottom: Spacing.two },
  filterBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    backgroundColor: '#EEE',
    marginRight: Spacing.two,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: Accessibility.colors.primaryAction },
  filterText: { fontSize: Accessibility.fontSize.normal, color: Accessibility.colors.calmText },
  filterTextActive: { color: Accessibility.colors.primaryActionText, fontWeight: '700' },
  alertsList: { gap: Spacing.three },
  alertCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryText: { fontSize: Accessibility.fontSize.small, color: Accessibility.colors.calmTextSecondary, fontStyle: 'italic' },
  alertTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  alertSummary: { fontSize: Accessibility.fontSize.normal, color: Accessibility.colors.calmText, lineHeight: 26 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginTop: Spacing.one },
  sourceText: { fontSize: Accessibility.fontSize.small, color: Accessibility.colors.calmTextSecondary },
});
