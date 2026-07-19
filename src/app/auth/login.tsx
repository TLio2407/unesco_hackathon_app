import { StyleSheet, TextInput, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Accessibility } from '@/theme/tokens';
import { t } from '@/i18n';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // Basic bypass for prototype
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {t('auth.login.title') || 'Đăng nhập'}
          </ThemedText>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t('auth.login.phonePlaceholder') || 'Số điện thoại'}
              keyboardType="phone-pad"
            />
            <Pressable style={styles.button} onPress={handleLogin}>
              <ThemedText style={styles.buttonText}>
                {t('auth.login.submit') || 'Tiếp tục'}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, padding: Spacing.four, justifyContent: 'center' },
  title: { marginBottom: Spacing.five, textAlign: 'center' },
  form: { gap: Spacing.three },
  input: {
    height: Accessibility.minTouchSize,
    borderWidth: 1,
    borderColor: Accessibility.colors.calmTextSecondary,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: Accessibility.fontSize.normal,
  },
  button: {
    height: Accessibility.minTouchSize,
    backgroundColor: Accessibility.colors.primaryAction,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Accessibility.colors.primaryActionText,
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '700',
  },
});
