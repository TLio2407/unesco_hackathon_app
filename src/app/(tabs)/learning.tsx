import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { MaxContentWidth, Spacing } from '@/constants/theme';

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
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {t('learning.title')}
          </ThemedText>

          <View style={styles.lessonsList}>
            {MOCK_LESSONS.map(lesson => (
              <ThemedView key={lesson.id} type="backgroundElement" style={styles.lessonCard}>
                <View style={styles.lessonHeader}>
                  <Ionicons name="book" size={28} color={Accessibility.colors.primaryAction} />
                  <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
                  {completedLessons.includes(lesson.id) && (
                    <Ionicons name="checkmark-circle" size={28} color={Accessibility.colors.riskSafe} />
                  )}
                </View>

                <View style={styles.points}>
                  {lesson.points.map((p, i) => (
                    <View key={i} style={styles.pointRow}>
                      <ThemedText style={styles.bullet}>•</ThemedText>
                      <ThemedText style={styles.pointText}>{p}</ThemedText>
                    </View>
                  ))}
                </View>

                <View style={styles.quiz}>
                  <ThemedText style={styles.quizQuestion}>{lesson.quiz.question}</ThemedText>
                  {lesson.quiz.options.map((opt, idx) => (
                    <Pressable
                      key={idx}
                      style={styles.optionBtn}
                      onPress={() => handleQuiz(lesson.id, idx, lesson.quiz.correctIndex)}>
                      <ThemedText style={styles.optionText}>{opt}</ThemedText>
                    </Pressable>
                  ))}
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
  lessonsList: { gap: Spacing.four },
  lessonCard: { padding: Spacing.four, borderRadius: Spacing.four, gap: Spacing.three },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  lessonTitle: { flex: 1, fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  points: { gap: Spacing.one },
  pointRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { fontSize: Accessibility.fontSize.normal, color: Accessibility.colors.primaryAction },
  pointText: { flex: 1, fontSize: Accessibility.fontSize.normal, color: Accessibility.colors.calmText },
  quiz: { marginTop: Spacing.two, gap: Spacing.two, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: Spacing.three },
  quizQuestion: { fontSize: Accessibility.fontSize.normal, fontWeight: '700', marginBottom: Spacing.one },
  optionBtn: {
    backgroundColor: Accessibility.colors.surfaceCard,
    borderWidth: 2,
    borderColor: Accessibility.colors.primaryAction,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  optionText: { fontSize: Accessibility.fontSize.normal, textAlign: 'center' },
});
