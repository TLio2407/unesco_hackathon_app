import { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PageContainer } from '@/components/page-container';
import { AudioReadback } from '@/components/audio-readback';
import { DualPane } from '@/components/dual-pane';
import { useResponsive } from '@/hooks/use-responsive';
import {
  TAXONOMY_MODULES,
  STRUCTURED_LESSONS,
  getTaxonomyModules,
  getLessonsByModule,
  calculateProgress,
  evaluateBadges,
  generateCertificate,
  ModuleCategory,
  MicroLesson,
  DigitalCertificate,
} from '@/lib/learning-taxonomy';
import { useLanguageDialect } from '@/i18n/regional';

type ActiveModule = ModuleCategory | 'all';

export default function LearningScreen() {
  const theme = useTheme();
  const { isWide } = useResponsive();
  const [dialect] = useLanguageDialect();

  const modules = getTaxonomyModules(dialect);
  const [activeModule, setActiveModule] = useState<ActiveModule>('all');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const lessons = getLessonsByModule(activeModule, dialect);
  const [selectedLesson, setSelectedLesson] = useState<MicroLesson>(lessons[0] || STRUCTURED_LESSONS[0]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificate, setCertificate] = useState<DigitalCertificate | null>(null);

  const { percent, completed, total } = calculateProgress(completedLessons);
  const badges = evaluateBadges(completedLessons);

  const handleQuiz = (lessonId: number, optionIndex: number, correctIndex: number) => {
    if (optionIndex === correctIndex) {
      if (!completedLessons.includes(lessonId)) {
        setCompletedLessons((prev) => [...prev, lessonId]);
      }
      Alert.alert('Chính xác! 🎉', 'Cô/chú đã trả lời đúng và tích lũy thêm điểm an toàn số.');
    } else {
      Alert.alert('Chưa chính xác', 'Cô/chú hãy xem lại gợi ý bài học và thử chọn lại nhé.');
    }
  };

  const handleShowCert = () => {
    const cert = generateCertificate('Cô/Chú An Tâm', completedLessons);
    setCertificate(cert);
    setShowCertificateModal(true);
  };

  const masterPane = (
    <View style={styles.paneContent}>
      <ThemedText type="title" style={styles.title}>
        {t('learning.title')} (Lộ trình Khóa học MIL)
      </ThemedText>

      {/* Progress Bar Card */}
      <ThemedView type="backgroundElement" style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Ionicons name="ribbon-outline" size={28} color={theme.primaryAction} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.progressTitle}>Tiến độ học tập an toàn</ThemedText>

            <ThemedText style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
              Đã hoàn thành {completed}/{total} bài học ({percent}%)
            </ThemedText>
          </View>
        </View>

        <View style={[styles.progressBarBg, { backgroundColor: theme.cardBorder }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percent}%`, backgroundColor: theme.primaryAction },
            ]}
          />
        </View>

        <Pressable
          style={[styles.badgeBtn, { backgroundColor: theme.primaryAction }]}
          onPress={handleShowCert}
          accessibilityRole="button"
          accessibilityLabel="Xem Huy hiệu & Bằng khen số">
          <Ionicons name="trophy-outline" size={20} color={theme.primaryActionText} />
          <ThemedText style={[styles.badgeBtnText, { color: theme.primaryActionText }]}>
            Bằng khen & Huy hiệu đã đạt
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Taxonomy Module Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moduleScroll}>
        <Pressable
          style={[
            styles.moduleChip,
            {
              backgroundColor: activeModule === 'all' ? theme.primaryAction : theme.surfaceCard,
              borderColor: activeModule === 'all' ? theme.primaryAction : theme.cardBorder,
            },
          ]}
          onPress={() => setActiveModule('all')}
          accessibilityRole="button">
          <ThemedText
            style={[
              styles.moduleChipText,
              { color: activeModule === 'all' ? theme.primaryActionText : theme.text },
            ]}>
            Tất cả bài học
          </ThemedText>
        </Pressable>

        {modules.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <Pressable
              key={mod.id}
              style={[
                styles.moduleChip,
                {
                  backgroundColor: isActive ? theme.primaryAction : theme.surfaceCard,
                  borderColor: isActive ? theme.primaryAction : theme.cardBorder,
                },
              ]}
              onPress={() => setActiveModule(mod.id)}
              accessibilityRole="button">
              <Ionicons
                name={mod.icon as any}
                size={18}
                color={isActive ? theme.primaryActionText : theme.primaryAction}
              />
              <ThemedText
                style={[
                  styles.moduleChipText,
                  { color: isActive ? theme.primaryActionText : theme.text },
                ]}>
                {mod.title}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Lessons List */}
      <View style={styles.lessonsList}>
        {lessons.map((lesson) => {
          const isDone = completedLessons.includes(lesson.id);
          const isSelected = selectedLesson?.id === lesson.id;
          return (
            <Pressable
              key={lesson.id}
              onPress={() => setSelectedLesson(lesson)}
              accessibilityRole="button">
              <ThemedView
                type="backgroundElement"
                style={[
                  styles.lessonCard,
                  isSelected && { borderColor: theme.primaryAction, borderWidth: 2 },
                ]}>
                <View style={styles.lessonHeader}>
                  <Ionicons name="book" size={28} color={theme.primaryAction} />
                  <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
                  {isDone && <Ionicons name="checkmark-circle" size={28} color={theme.riskSafe} />}
                </View>
                <ThemedText style={[styles.summaryText, { color: theme.textSecondary }]}>
                  {lesson.summary}
                </ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const detailPane = selectedLesson ? (
    <ThemedView type="backgroundElement" style={styles.detailCard}>
      <View style={styles.lessonHeader}>
        <Ionicons name="book-outline" size={32} color={theme.primaryAction} />
        <ThemedText style={styles.detailLessonTitle}>{selectedLesson.title}</ThemedText>
      </View>

      <AudioReadback
        text={`Bài học: ${selectedLesson.title}. Gợi ý quan trọng: ${selectedLesson.points.join('. ')}`}
        label="Nghe bài học"
      />

      <View style={styles.points}>
        <ThemedText style={styles.pointsTitle}>Các lưu ý quan trọng cho người cao tuổi:</ThemedText>
        {selectedLesson.points.map((p, i) => (
          <View key={i} style={styles.pointRow}>
            <ThemedText style={[styles.bullet, { color: theme.primaryAction }]}>•</ThemedText>
            <ThemedText style={styles.pointText}>{p}</ThemedText>
          </View>
        ))}
      </View>

      <View style={[styles.quizBox, { borderTopColor: theme.cardBorder }]}>
        <ThemedText style={styles.quizQuestion}>{selectedLesson.quiz.question}</ThemedText>
        {selectedLesson.quiz.options.map((opt, idx) => (
          <Pressable
            key={idx}
            style={[styles.optionBtn, { backgroundColor: theme.surfaceCard, borderColor: theme.primaryAction }]}
            onPress={() => handleQuiz(selectedLesson.id, idx, selectedLesson.quiz.correctIndex)}
            accessibilityRole="button">
            <ThemedText style={styles.optionText}>{opt}</ThemedText>
          </Pressable>
        ))}

        <View style={[styles.explanationBox, { backgroundColor: theme.riskSafeBg, borderColor: theme.riskSafe }]}>
          <Ionicons name="information-circle-outline" size={20} color={theme.riskSafe} />
          <ThemedText style={[styles.explanationText, { color: theme.riskSafe }]}>
            Giải thích: {selectedLesson.quiz.explanation}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  ) : null;

  return (
    <PageContainer>
      {isWide ? (
        <DualPane master={masterPane} detail={detailPane} />
      ) : (
        <View style={styles.mobileWrap}>
          {masterPane}
          {detailPane}
        </View>
      )}

      {/* Badges & Certificate Modal */}
      <Modal
        visible={showCertificateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCertificateModal(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: theme.surfaceCard, borderColor: theme.cardBorder }]}>
            <View style={styles.certHeader}>
              <Ionicons name="ribbon" size={48} color={theme.primaryAction} />
              <ThemedText style={styles.certTitle}>Bằng khen & Huy hiệu Số</ThemedText>
              <ThemedText style={[styles.certSub, { color: theme.textSecondary }]}>
                Chương trình UNESCO MIL Digital Inclusion
              </ThemedText>
            </View>

            {/* Badges Grid */}
            <ThemedText style={styles.badgeSectionTitle}>Huy hiệu đã mở khóa:</ThemedText>
            <View style={styles.badgeGrid}>
              {badges.map((b) => (
                <View
                  key={b.id}
                  style={[
                    styles.badgeCard,
                    {
                      backgroundColor: b.unlocked ? theme.riskSafeBg : theme.backgroundElement,
                      borderColor: b.unlocked ? theme.riskSafe : theme.cardBorder,
                      opacity: b.unlocked ? 1 : 0.5,
                    },
                  ]}>
                  <Ionicons
                    name={b.icon as any}
                    size={28}
                    color={b.unlocked ? theme.riskSafe : theme.textSecondary}
                  />
                  <ThemedText style={[styles.badgeName, { color: b.unlocked ? theme.text : theme.textSecondary }]}>
                    {b.name}
                  </ThemedText>
                </View>
              ))}
            </View>

            {/* Certificate Box */}
            {certificate && (
              <View style={[styles.certificateBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.primaryAction }]}>
                <ThemedText style={[styles.certSubject, { color: theme.primaryAction }]}>
                  CHỨNG NHẬN HOÀN THÀNH KỸ NĂNG AN TÂM SỐ
                </ThemedText>
                <ThemedText style={styles.certName}>{certificate.userName}</ThemedText>
                <ThemedText style={styles.certDesc}>
                  Đã hoàn thành {certificate.totalCompleted} bài học an toàn thông tin ({certificate.scorePercent}%)
                </ThemedText>
                <ThemedText style={[styles.certFooter, { color: theme.textSecondary }]}>
                  Mã xác thực: {certificate.certificateId}
                </ThemedText>
              </View>
            )}

            <Pressable
              style={[styles.closeBtn, { backgroundColor: theme.primaryAction }]}
              onPress={() => setShowCertificateModal(false)}>
              <ThemedText style={[styles.closeBtnText, { color: theme.primaryActionText }]}>Đóng</ThemedText>
            </Pressable>
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
  progressCard: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  progressTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  progressSubtitle: { fontSize: Accessibility.fontSize.small },
  progressBarBg: { height: 12, borderRadius: 6, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 6 },
  badgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
  },
  badgeBtnText: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  moduleScroll: { marginVertical: Spacing.one },
  moduleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 1,
    marginRight: Spacing.two,
    minHeight: 44,
  },
  moduleChipText: { fontSize: Accessibility.fontSize.normal, fontWeight: '600' },
  lessonsList: { gap: Spacing.three },
  lessonCard: { padding: Spacing.three, borderRadius: Spacing.four, gap: Spacing.two },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  lessonTitle: { flex: 1, fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  summaryText: { fontSize: Accessibility.fontSize.small, lineHeight: 22 },
  detailCard: { padding: Spacing.four, borderRadius: Spacing.four, gap: Spacing.three },
  detailLessonTitle: { flex: 1, fontSize: Accessibility.fontSize.title, fontWeight: '700' },
  pointsTitle: { fontSize: Accessibility.fontSize.normal, fontWeight: '700', marginBottom: Spacing.one },
  points: { gap: Spacing.one },
  pointRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { fontSize: Accessibility.fontSize.normal },
  pointText: { flex: 1, fontSize: Accessibility.fontSize.normal, lineHeight: 26 },
  quizBox: { marginTop: Spacing.two, gap: Spacing.two, borderTopWidth: 1, paddingTop: Spacing.three },
  quizQuestion: { fontSize: Accessibility.fontSize.normal, fontWeight: '700', marginBottom: Spacing.one },
  optionBtn: {
    borderWidth: 2,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  optionText: { fontSize: Accessibility.fontSize.normal, textAlign: 'center' },
  explanationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    marginTop: Spacing.one,
  },
  explanationText: { fontSize: Accessibility.fontSize.small, flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 550,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
  },
  certHeader: { alignItems: 'center', gap: Spacing.one },
  certTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  certSub: { fontSize: Accessibility.fontSize.small },
  badgeSectionTitle: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  badgeCard: {
    padding: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: 1,
    alignItems: 'center',
    width: '47%',
    gap: Spacing.one,
  },
  badgeName: { fontSize: Accessibility.fontSize.small, fontWeight: '600', textAlign: 'center' },
  certificateBox: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 2,
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  certSubject: { fontSize: Accessibility.fontSize.small, fontWeight: '700', textAlign: 'center' },
  certName: { fontSize: Accessibility.fontSize.title, fontWeight: '700' },
  certDesc: { fontSize: Accessibility.fontSize.small, textAlign: 'center' },
  certFooter: { fontSize: Accessibility.fontSize.small, fontStyle: 'italic' },
  closeBtn: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    minHeight: Accessibility.minTouchSize,
  },
  closeBtnText: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
});
