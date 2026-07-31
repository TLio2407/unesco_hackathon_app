import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { SIMPLIFIED_GLOSSARY, GlossaryTerm } from '@/i18n/regional';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { Accessibility } from '@/theme/tokens';

export function SimplifiedGlossary() {
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceElevated, borderColor: theme.cardBorder }]}>
      <View style={styles.header}>
        <Ionicons name="help-buoy-outline" size={24} color={theme.primaryAction} />
        <ThemedText style={[styles.title, { color: theme.primaryAction }]}>
          Từ điển Giải thích Đơn giản (Cho Người cao tuổi)
        </ThemedText>
      </View>

      <ThemedText style={styles.subtext}>
        Bấm vào thuật ngữ để xem giải thích bằng hình ảnh ví dụ đời sống:
      </ThemedText>

      <View style={styles.chipGrid}>
        {Object.values(SIMPLIFIED_GLOSSARY).map((item) => {
          const isSelected = selectedTerm?.term === item.term;
          return (
            <Pressable
              key={item.term}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.primaryAction : theme.surfaceCard,
                  borderColor: theme.primaryAction,
                },
              ]}
              onPress={() => setSelectedTerm(isSelected ? null : item)}
              accessibilityRole="button"
              accessibilityLabel={`Thuật ngữ: ${item.term}`}>
              <ThemedText
                style={[
                  styles.chipText,
                  { color: isSelected ? theme.primaryActionText : theme.text },
                ]}>
                {item.term}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {selectedTerm && (
        <View style={[styles.detailBox, { backgroundColor: theme.riskSafeBg, borderColor: theme.riskSafe }]}>
          <ThemedText style={[styles.termTitle, { color: theme.riskSafe }]}>
            {selectedTerm.term} ➔ {selectedTerm.simpleTranslation}
          </ThemedText>
          <ThemedText style={styles.analogyText}>
            💡 Ví dụ dễ hiểu: {selectedTerm.analogy}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1,
    gap: Spacing.two,
    marginVertical: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: Accessibility.fontSize.large,
    fontWeight: '700',
    flex: 1,
  },
  subtext: {
    fontSize: Accessibility.fontSize.small,
    lineHeight: 22,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginVertical: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 2,
    minHeight: Accessibility.minTouchSize,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
  },
  detailBox: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  termTitle: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '700',
  },
  analogyText: {
    fontSize: Accessibility.fontSize.normal,
    lineHeight: 24,
  },
});
