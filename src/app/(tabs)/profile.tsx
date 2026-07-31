import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, ColorBlindnessMode } from '@/constants/theme';
import { Accessibility } from '@/theme/tokens';
import { PageContainer } from '@/components/page-container';
import { useTheme, useColorBlindnessMode } from '@/hooks/use-theme';
import { useLanguageDialect, DIALECTS, DialectCode } from '@/i18n/regional';
import { t } from '@/i18n';

export default function ProfileScreen() {
  const theme = useTheme();
  const [cbMode, setCbMode] = useColorBlindnessMode();
  const [dialect, setDialect] = useLanguageDialect();

  const cbOptions: { key: ColorBlindnessMode; label: string; desc: string }[] = [
    { key: 'standard', label: 'Standard', desc: 'High contrast tuned for elderly vision' },
    { key: 'protanopia', label: 'Protanopia', desc: 'Optimized for red color blindness' },
    { key: 'deuteranopia', label: 'Deuteranopia', desc: 'Optimized for green color blindness' },
    { key: 'tritanopia', label: 'Tritanopia', desc: 'Optimized for blue color blindness' },
    { key: 'highContrast', label: 'High Contrast', desc: 'Maximum contrast black & white mode' },
  ];

  return (
    <PageContainer>
      {/* User Info Header */}
      <ThemedView type="backgroundElement" style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={64} color={theme.primaryAction} />
        <ThemedText style={styles.userName}>{t('profile.userName')}</ThemedText>
        <ThemedText style={[styles.userRole, { color: theme.textSecondary }]}>
          {t('profile.userRole')}
        </ThemedText>
      </ThemedView>

      {/* Accessibility: Color Blindness Modes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye-outline" size={24} color={theme.primaryAction} />
          <ThemedText style={styles.sectionTitle}>{t('profile.accessibilityTitle')}</ThemedText>
        </View>

        <View style={styles.optionList}>
          {cbOptions.map((opt) => {
            const isActive = cbMode === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isActive ? theme.surfaceElevated : theme.surfaceCard,
                    borderColor: isActive ? theme.primaryAction : theme.cardBorder,
                    borderWidth: isActive ? 2 : 1,
                  },
                ]}
                onPress={() => setCbMode(opt.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Chế độ hiển thị: ${opt.label}`}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.optionLabel, isActive && { color: theme.primaryAction }]}>
                    {opt.label}
                  </ThemedText>
                  <ThemedText style={[styles.optionDesc, { color: theme.textSecondary }]}>
                    {opt.desc}
                  </ThemedText>
                </View>
                {isActive && <Ionicons name="checkmark-circle" size={24} color={theme.primaryAction} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Language & Regional Dialects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="language-outline" size={24} color={theme.primaryAction} />
          <ThemedText style={styles.sectionTitle}>{t('profile.languageTitle')}</ThemedText>
        </View>

        <View style={styles.optionList}>
          {Object.values(DIALECTS).map((d) => {
            const isActive = dialect === d.code;
            return (
              <Pressable
                key={d.code}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isActive ? theme.surfaceElevated : theme.surfaceCard,
                    borderColor: isActive ? theme.primaryAction : theme.cardBorder,
                    borderWidth: isActive ? 2 : 1,
                  },
                ]}
                onPress={() => setDialect(d.code)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Ngôn ngữ: ${d.name}`}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.optionLabel, isActive && { color: theme.primaryAction }]}>
                    {d.name}
                  </ThemedText>
                  <ThemedText style={[styles.optionDesc, { color: theme.textSecondary }]}>
                    Cách xưng hô thân mật: "{d.addressUser}"
                  </ThemedText>
                </View>
                {isActive && <Ionicons name="checkmark-circle" size={24} color={theme.primaryAction} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* App Info */}
      <ThemedView type="backgroundElement" style={styles.infoCard}>
        <ThemedText style={styles.infoTitle}>An Tâm Số — UNESCO Youth Hackathon 2026</ThemedText>
        <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
          Phiên bản 1.0.0 (WP4 Extended Edition) • Ứng dụng đồng hành tin cậy nâng cao năng lực truyền thông & số (MIL) cho người cao tuổi.
        </ThemedText>
      </ThemedView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: Accessibility.fontSize.title, marginBottom: Spacing.two },
  profileCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  userName: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  userRole: { fontSize: Accessibility.fontSize.small },
  section: { gap: Spacing.two, marginBottom: Spacing.three },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  sectionTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700', flex: 1 },
  optionList: { gap: Spacing.two },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    minHeight: Accessibility.minTouchSize,
  },
  optionLabel: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  optionDesc: { fontSize: Accessibility.fontSize.small, marginTop: 2 },
  infoCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  infoTitle: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  infoText: { fontSize: Accessibility.fontSize.small, lineHeight: 20 },
});
