import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Lớp học Smartphone cho Người cao tuổi',
    date: '15/07/2026',
    location: 'Nhà văn hóa Quận 1',
    type: 'Workshop',
  },
  {
    id: 2,
    title: 'Hội thảo An toàn trên không gian mạng',
    date: '20/07/2026',
    location: 'Hội người cao tuổi Phường Bến Nghé',
    type: 'Seminar',
  },
];

const PARTNERS = [
  { id: 1, name: 'Hội Người cao tuổi Việt Nam', icon: 'people-circle-outline' },
  { id: 2, name: 'Cục An toàn thông tin', icon: 'shield-checkmark-outline' },
  { id: 3, name: 'Đoàn Thanh niên (Tình nguyện viên)', icon: 'ribbon-outline' },
];

export default function CommunityScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {t('community.title')}
          </ThemedText>

          <ThemedText style={styles.body}>
            {t('community.placeholder')}
          </ThemedText>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Sự kiện sắp tới</ThemedText>
            {MOCK_EVENTS.map(event => (
              <ThemedView key={event.id} type="backgroundElement" style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.primaryAction }]}>
                    <ThemedText style={[styles.typeText, { color: theme.primaryAction }]}>{event.type}</ThemedText>
                  </View>
                  <ThemedText style={[styles.eventDate, { color: theme.textSecondary }]}>{event.date}</ThemedText>
                </View>
                <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={20} color={theme.textSecondary} />
                  <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>{event.location}</ThemedText>
                </View>
                <Pressable style={[styles.joinBtn, { backgroundColor: theme.primaryAction }]}>
                  <ThemedText style={[styles.joinBtnText, { color: theme.primaryActionText }]}>Đăng ký tham gia</ThemedText>
                </Pressable>
              </ThemedView>
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Đối tác tin cậy</ThemedText>
            <ThemedView type="backgroundElement" style={styles.partnerMap}>
              {PARTNERS.map(partner => (
                <View key={partner.id} style={styles.partnerItem}>
                  <Ionicons name={partner.icon as any} size={40} color={theme.primaryAction} />
                  <ThemedText style={styles.partnerName}>{partner.name}</ThemedText>
                </View>
              ))}
              <View style={styles.mapHint}>
                <Ionicons name="map-outline" size={24} color={theme.textSecondary} />
                <ThemedText style={[styles.mapHintText, { color: theme.textSecondary }]}>Xem bản đồ các điểm hỗ trợ MIL gần cô/chú</ThemedText>
              </View>
              <Pressable style={[styles.mapBtn, { backgroundColor: theme.surfaceCard, borderColor: theme.primaryAction }]}>
                 <ThemedText style={[styles.mapBtnText, { color: theme.primaryAction }]}>Mở bản đồ đối tác</ThemedText>
              </Pressable>
            </ThemedView>
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
  body: {
    fontSize: Accessibility.fontSize.normal,
    lineHeight: 28,
  },
  section: { gap: Spacing.three },
  sectionTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  eventCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
    borderWidth: 1,
  },
  typeText: { fontSize: Accessibility.fontSize.small, fontWeight: '700' },
  eventDate: { fontSize: Accessibility.fontSize.normal },
  eventTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  locationText: { fontSize: Accessibility.fontSize.normal },
  joinBtn: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  joinBtnText: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  partnerMap: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.three,
  },
  partnerItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  partnerName: { fontSize: Accessibility.fontSize.normal, fontWeight: '600', flex: 1 },
  mapHint: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.two },
  mapHintText: { fontSize: Accessibility.fontSize.small, flex: 1 },
  mapBtn: {
    borderWidth: 2,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
  },
  mapBtnText: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
});
