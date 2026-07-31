import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { RiskBadge } from '@/components/risk-badge';
import { useTheme } from '@/hooks/use-theme';
import { PageContainer } from '@/components/page-container';
import { AudioReadback } from '@/components/audio-readback';
import { DualPane } from '@/components/dual-pane';
import { useResponsive } from '@/hooks/use-responsive';
import {
  OFFICIAL_THREAT_FEEDS,
  filterThreatAlerts,
  dispatchAlertToCircle,
  ThreatAlert,
  ThreatSource,
  ThreatCategory,
} from '@/lib/threat-feeds';

type SourceFilter = ThreatSource | 'All';
type CategoryFilter = ThreatCategory | 'All';

export default function AlertsScreen() {
  const theme = useTheme();
  const { isWide } = useResponsive();

  const [activeSource, setActiveSource] = useState<SourceFilter>('All');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [search, setSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(OFFICIAL_THREAT_FEEDS[0] || null);

  // Dispatch modal state
  const [dispatchModalAlert, setDispatchModalAlert] = useState<ThreatAlert | null>(null);
  const [customDispatchNote, setCustomDispatchNote] = useState('');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const filteredAlerts = filterThreatAlerts(OFFICIAL_THREAT_FEEDS, {
    source: activeSource,
    category: activeCategory,
    search,
  });

  const handleDispatchSubmit = () => {
    if (!dispatchModalAlert) return;
    dispatchAlertToCircle(dispatchModalAlert, 2, customDispatchNote);
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setDispatchModalAlert(null);
      setCustomDispatchNote('');
    }, 1500);
  };

  const listPane = (
    <View style={styles.paneContent}>
      <ThemedText type="title" style={styles.title}>
        {t('alert.title')} (Cổng Cảnh báo Chính thức)
      </ThemedText>

      <View style={[styles.searchBar, { backgroundColor: theme.surfaceCard, borderColor: theme.cardBorder }]}>
        <Ionicons name="search" size={24} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Tìm kiếm cảnh báo từ Bộ Công an, NHNN..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel="Tìm kiếm cảnh báo"
        />
      </View>

      {/* Source Filters */}
      <View style={styles.filterSection}>
        <ThemedText style={styles.filterSectionTitle}>Nguồn dữ liệu uy tín:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['All', 'Bộ Công an', 'Cục An toàn thông tin', 'Ngân hàng Nhà nước'] as SourceFilter[]).map((src) => {
            const isActive = activeSource === src;
            return (
              <Pressable
                key={src}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: isActive ? theme.primaryAction : theme.backgroundElement,
                    borderColor: isActive ? theme.primaryAction : theme.cardBorder,
                  },
                ]}
                onPress={() => setActiveSource(src)}
                accessibilityRole="button"
                accessibilityLabel={`Lọc nguồn: ${src}`}>
                <ThemedText
                  style={[
                    styles.filterText,
                    { color: isActive ? theme.primaryActionText : theme.text, fontWeight: isActive ? '700' : '400' },
                  ]}>
                  {src === 'All' ? 'Tất cả nguồn' : src}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Category Filters */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['All', 'Fake Authority', 'Scam', 'Banking', 'Health'] as CategoryFilter[]).map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? theme.surfaceElevated : theme.surfaceCard,
                    borderColor: isActive ? theme.primaryAction : theme.cardBorder,
                  },
                ]}
                onPress={() => setActiveCategory(cat)}
                accessibilityRole="button"
                accessibilityLabel={`Phân loại: ${cat}`}>
                <ThemedText
                  style={[
                    styles.filterChipText,
                    { color: isActive ? theme.primaryAction : theme.textSecondary },
                  ]}>
                  {cat === 'All' ? 'Tất cả loại' : cat}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Alerts List */}
      <View style={styles.alertsList}>
        {filteredAlerts.length === 0 ? (
          <ThemedText style={styles.emptyText}>Không tìm thấy cảnh báo phù hợp.</ThemedText>
        ) : (
          filteredAlerts.map((alert) => (
            <Pressable
              key={alert.id}
              onPress={() => setSelectedAlert(alert)}
              accessibilityRole="button">
              <ThemedView
                type="backgroundElement"
                style={[
                  styles.alertCard,
                  selectedAlert?.id === alert.id && { borderColor: theme.primaryAction, borderWidth: 2 },
                ]}>
                <View style={styles.cardHeader}>
                  <RiskBadge level={alert.risk} />
                  <ThemedText style={[styles.categoryText, { color: theme.textSecondary }]}>
                    {alert.category}
                  </ThemedText>
                </View>
                <ThemedText style={styles.alertTitle}>{alert.title}</ThemedText>
                <ThemedText style={styles.alertSummary}>{alert.summary}</ThemedText>

                <View style={styles.cardFooter}>
                  <Ionicons name="newspaper-outline" size={18} color={theme.textSecondary} />
                  <ThemedText style={[styles.sourceText, { color: theme.textSecondary }]}>
                    Nguồn: {alert.source} • {alert.publishedAt}
                  </ThemedText>
                </View>

                <Pressable
                  style={[styles.dispatchBtn, { backgroundColor: theme.primaryAction }]}
                  onPress={() => setDispatchModalAlert(alert)}
                  accessibilityRole="button"
                  accessibilityLabel="Gửi cảnh báo đến Vòng tròn Người thân">
                  <Ionicons name="people-outline" size={20} color={theme.primaryActionText} />
                  <ThemedText style={[styles.dispatchBtnText, { color: theme.primaryActionText }]}>
                    Cảnh báo cho Người thân
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );

  const detailPane = selectedAlert ? (
    <ThemedView type="backgroundElement" style={styles.detailContainer}>
      <View style={styles.cardHeader}>
        <RiskBadge level={selectedAlert.risk} />
        <ThemedText style={[styles.categoryText, { color: theme.textSecondary }]}>
          {selectedAlert.category}
        </ThemedText>
      </View>

      <ThemedText style={styles.detailTitle}>{selectedAlert.title}</ThemedText>

      <AudioReadback
        text={`Cảnh báo từ ${selectedAlert.source}. ${selectedAlert.title}. Nội dung: ${selectedAlert.summary}`}
        label="Đọc thông tin cảnh báo"
      />

      <ThemedText style={styles.detailSummary}>{selectedAlert.summary}</ThemedText>

      <View style={[styles.verifiedBox, { backgroundColor: theme.riskSafeBg, borderColor: theme.riskSafe }]}>
        <Ionicons name="checkmark-circle-outline" size={24} color={theme.riskSafe} />
        <ThemedText style={[styles.verifiedText, { color: theme.riskSafe }]}>
          Đã xác minh bởi: {selectedAlert.verifiedBy}
        </ThemedText>
      </View>

      {selectedAlert.affectedDemographic && (
        <View style={styles.metaRow}>
          <Ionicons name="people" size={20} color={theme.textSecondary} />
          <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
            Đối tượng bị nhắm tới: {selectedAlert.affectedDemographic}
          </ThemedText>
        </View>
      )}

      <Pressable
        style={[styles.dispatchBtnLarge, { backgroundColor: theme.primaryAction }]}
        onPress={() => setDispatchModalAlert(selectedAlert)}
        accessibilityRole="button"
        accessibilityLabel="Gửi cảnh báo khẩn cấp cho người thân">
        <Ionicons name="megaphone" size={24} color={theme.primaryActionText} />
        <ThemedText style={[styles.dispatchBtnTextLarge, { color: theme.primaryActionText }]}>
          Gửi cảnh báo Khẩn cấp cho Người thân
        </ThemedText>
      </Pressable>
    </ThemedView>
  ) : null;

  return (
    <PageContainer>
      {isWide ? (
        <DualPane master={listPane} detail={detailPane} />
      ) : (
        <View style={styles.mobileWrap}>
          {listPane}
        </View>
      )}

      {/* Dispatch Modal */}
      <Modal
        visible={!!dispatchModalAlert}
        transparent
        animationType="slide"
        onRequestClose={() => setDispatchModalAlert(null)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: theme.surfaceCard, borderColor: theme.cardBorder }]}>
            <ThemedText style={styles.modalTitle}>
              Gửi Cảnh báo đến Người thân
            </ThemedText>

            {dispatchSuccess ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={48} color={theme.riskSafe} />
                <ThemedText style={[styles.successText, { color: theme.riskSafe }]}>
                  Đã phát cảnh báo an toàn tới Vòng tròn Người thân!
                </ThemedText>
              </View>
            ) : (
              <>
                <ThemedText style={styles.modalSub}>
                  Nội dung cảnh báo: "{dispatchModalAlert?.title}"
                </ThemedText>
                <ThemedText style={styles.modalNote}>
                  (Thông tin nhạy cảm đã được hệ thống tự động làm sạch & bảo mật trước khi gửi)
                </ThemedText>

                <TextInput
                  style={[
                    styles.modalInput,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder, color: theme.text },
                  ]}
                  value={customDispatchNote}
                  onChangeText={setCustomDispatchNote}
                  placeholder="Thêm lời nhắn cho con/cháu (Ví dụ: Bác nhắn con cảnh giác chiêu này nhé)..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  accessibilityLabel="Lời nhắn kèm theo"
                />

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalButton, { backgroundColor: theme.backgroundElement }]}
                    onPress={() => setDispatchModalAlert(null)}>
                    <ThemedText style={[styles.cancelText, { color: theme.text }]}>Hủy</ThemedText>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, { backgroundColor: theme.primaryAction }]}
                    onPress={handleDispatchSubmit}>
                    <ThemedText style={[styles.confirmText, { color: theme.primaryActionText }]}>
                      Phát Cảnh báo Ngay
                    </ThemedText>
                  </Pressable>
                </View>
              </>
            )}
          </ThemedView>
        </View>
      </Modal>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  paneContent: { flex: 1, gap: Spacing.three },
  mobileWrap: { flex: 1, gap: Spacing.four },
  title: { fontSize: Accessibility.fontSize.title, marginBottom: Spacing.one },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    height: 56,
    borderWidth: 1,
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: Accessibility.fontSize.normal,
  },
  filterSection: { gap: Spacing.one },
  filterSectionTitle: { fontSize: Accessibility.fontSize.small, fontWeight: '700' },
  filterScroll: { marginVertical: Spacing.one },
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
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    borderWidth: 1,
    marginRight: Spacing.two,
  },
  filterChipText: { fontSize: Accessibility.fontSize.small, fontWeight: '600' },
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
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
    minHeight: 44,
  },
  dispatchBtnText: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  emptyText: { fontSize: Accessibility.fontSize.normal, textAlign: 'center', marginVertical: Spacing.four },
  detailContainer: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.three,
  },
  detailTitle: { fontSize: Accessibility.fontSize.title, fontWeight: '700' },
  detailSummary: { fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  verifiedText: { fontSize: Accessibility.fontSize.normal, fontWeight: '600', flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  metaText: { fontSize: Accessibility.fontSize.small },
  dispatchBtnLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    marginTop: Spacing.two,
    minHeight: Accessibility.minTouchSize,
  },
  dispatchBtnTextLarge: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
  },
  modalTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700', textAlign: 'center' },
  modalSub: { fontSize: Accessibility.fontSize.normal, fontWeight: '600' },
  modalNote: { fontSize: Accessibility.fontSize.small, fontStyle: 'italic', color: '#888' },
  modalInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: Accessibility.fontSize.normal,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  modalButton: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Accessibility.minTouchSize,
  },
  cancelText: { fontSize: Accessibility.fontSize.normal, fontWeight: '600' },
  confirmText: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  successBox: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
  successText: { fontSize: Accessibility.fontSize.large, fontWeight: '700', textAlign: 'center' },
});
