import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle">My Profile</ThemedText>

          <ThemedView type="backgroundElement" style={styles.profileCard}>
            <ThemedText type="smallBold">John Doe</ThemedText>
            <ThemedText type="small">MIL Advocate</ThemedText>
          </ThemedView>

          <ThemedText type="smallBold">Participation</ThemedText>
          <ThemedView type="backgroundElement" style={styles.infoRow}>
            <ThemedText type="small">Team Status:</ThemedText>
            <ThemedText type="smallBold">Joined "MIL Rangers"</ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.infoRow}>
            <ThemedText type="small">Hackathon Entry:</ThemedText>
            <ThemedText type="smallBold">In Progress</ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  profileCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
});
