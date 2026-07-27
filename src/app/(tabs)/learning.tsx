import { useState } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PageContainer } from '@/components/page-container';

const MOCK_LESSONS = [
  {
    id: 1,
    title: 'Nhận biết tin nhắn giả mạo',
    points: [
      'Kiểm tra SĐT người gửi',
      'Không bấm vào link lạ',
      'Cảnh giác với yêu cầu chuyển tiền gấp',
    ],
    quiz: {
      question: 'Khi nhận tin nhắn tự xưng là Công an yêu cầu chuyển tiền để điều tra, cô/chú nên làm gì?',
      options: ['Chuyển tiền ngay', 'Tuyệt đối không chuyển và báo người thân', 'Gửi thông tin tài khoản'],
      correctIndex: 1,
    },
  },
];

export default function LearningScreen() {
  const theme = useTheme();
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const handleQuiz = (lessonId: number, optionIndex: number, correctIndex: number) => {
    if (optionIndex === correctIndex) {
      Alert.alert('Chính xác!', 'Cô/chú đã nắm vững bài học.');
      setCompletedLessons([...completedLessons, lessonId]);
    } else {
      Alert.alert('Chưa đúng', 'Cô/chú hãy thử suy nghĩ lại nhé.');
    }
  };

  return (
    <PageContainer>
      <ThemedText type="title" style={styles.title}>
        {t('learning.title')}
      </ThemedText>

      <View style={styles.lessonsList}>
        {MOCK_LESSONS.map(lesson => (
          <ThemedView key={lesson.id} type="backgroundElement" style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <Ionicons name="book" size={28} color={theme.primaryAction} />
              <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
              {completedLessons.includes(lesson.id) && (
                <Ionicons name="checkmark-circle" size={28} color={theme.riskSafe} />
              )}
            </View>

            <View style={styles.points}>
              {lesson.points.map((p, i) => (
                <View key={i} style={styles.pointRow}>
                  <ThemedText style={[styles.bullet, { color: theme.primaryAction }]}>•</ThemedText>
                  <ThemedText style={styles.pointText}>{p}</ThemedText>
                </View>
              ))}
            </View>

            <View style={[styles.quiz, { borderTopColor: theme.cardBorder }]}>
              <ThemedText style={styles.quizQuestion}>{lesson.quiz.question}</ThemedText>
              {lesson.quiz.options.map((opt, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.optionBtn, { backgroundColor: theme.surfaceCard, borderColor: theme.primaryAction }]}
                  onPress={() => handleQuiz(lesson.id, idx, lesson.quiz.correctIndex)}>
                  <ThemedText style={styles.optionText}>{opt}</ThemedText>
                </Pressable>
              ))}
            </View>
          </ThemedView>
        ))}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: Accessibility.fontSize.title, marginBottom: Spacing.two },
  lessonsList: { gap: Spacing.four },
  lessonCard: { padding: Spacing.four, borderRadius: Spacing.four, gap: Spacing.three },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  lessonTitle: { flex: 1, fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  points: { gap: Spacing.one },
  pointRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { fontSize: Accessibility.fontSize.normal },
  pointText: { flex: 1, fontSize: Accessibility.fontSize.normal, lineHeight: 26 },
  quiz: { marginTop: Spacing.two, gap: Spacing.two, borderTopWidth: 1, paddingTop: Spacing.three },
  quizQuestion: { fontSize: Accessibility.fontSize.normal, fontWeight: '700', marginBottom: Spacing.one },
  optionBtn: {
    borderWidth: 2,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  optionText: { fontSize: Accessibility.fontSize.normal, textAlign: 'center' },
});
