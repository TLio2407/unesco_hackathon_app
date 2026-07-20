import { useState } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';

import { ThemedText } from './themed-text';
import { t } from '@/i18n';
import type { LessonCard } from '@/api/contract';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export function LessonCard({ card }: { card: LessonCard }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleQuiz = (option: string) => {
    setSelectedOption(option);
    if (option === card.quiz?.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  // Create mock options for the demo if only one answer is provided
  const options = card.quiz ? [card.quiz.answer, "Làm theo ngay", "Gửi thông tin cho họ"] : [];
  // Shuffle options for better demo (simple sort)
  const shuffledOptions = options.sort((a, b) => a.length - b.length);

  return (
    <View style={styles.card}>
      <ThemedText type="subtitle" style={styles.title}>
        {t('companion.result.lesson')}: {card.title}
      </ThemedText>

      <View style={styles.pointsList}>
        {card.points.map((p, i) => (
          <View key={i} style={styles.item}>
            <Ionicons name="checkmark-circle" size={24} color={Accessibility.colors.riskSafe} />
            <ThemedText style={styles.point}>{p}</ThemedText>
          </View>
        ))}
      </View>

      {card.quiz && (
        <View style={styles.quizSection}>
          <ThemedText style={styles.quizQuestion}>
            Câu hỏi: {card.quiz.question}
          </ThemedText>

          <View style={styles.optionsList}>
            {shuffledOptions.map((opt, idx) => (
              <Pressable
                key={idx}
                style={[
                  styles.optionBtn,
                  selectedOption === opt && (isCorrect ? styles.correctBtn : styles.incorrectBtn)
                ]}
                onPress={() => handleQuiz(opt)}
                disabled={selectedOption !== null}
              >
                <ThemedText style={[
                  styles.optionText,
                  selectedOption === opt && { color: '#FFF' }
                ]}>
                  {opt}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {isCorrect === true && (
            <ThemedText style={styles.feedbackCorrect}>Chính xác! Cô/chú đã hiểu bài rồi đó.</ThemedText>
          )}
          {isCorrect === false && (
            <ThemedText style={styles.feedbackIncorrect}>Chưa đúng rồi. Đáp án đúng là: {card.quiz.answer}</ThemedText>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: Accessibility.colors.surfaceElevated,
    borderLeftWidth: 6,
    borderLeftColor: Accessibility.colors.primaryAction,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  pointsList: { gap: Spacing.two },
  item: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  point: { flex: 1, fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
  quizSection: {
    marginTop: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    gap: Spacing.two,
  },
  quizQuestion: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  optionsList: { gap: Spacing.two, marginTop: Spacing.one },
  optionBtn: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 2,
    borderColor: Accessibility.colors.primaryAction,
    backgroundColor: Accessibility.colors.surfaceCard,
  },
  optionText: { fontSize: Accessibility.fontSize.normal, textAlign: 'center' },
  correctBtn: { backgroundColor: Accessibility.colors.riskSafe, borderColor: Accessibility.colors.riskSafe },
  incorrectBtn: { backgroundColor: Accessibility.colors.riskHigh, borderColor: Accessibility.colors.riskHigh },
  feedbackCorrect: { color: Accessibility.colors.riskSafe, fontWeight: '700', marginTop: Spacing.one, textAlign: 'center' },
  feedbackIncorrect: { color: Accessibility.colors.riskHigh, fontWeight: '700', marginTop: Spacing.one, textAlign: 'center' },
});
