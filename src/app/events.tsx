import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function EventsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle">Upcoming Events</ThemedText>
          <ThemedText themeColor="textSecondary">
            Global Media and Information Literacy Week & Youth Hackathon.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.eventItem}>
            <ThemedText type="smallBold">Registration Opens</ThemedText>
            <ThemedText type="small">July 2025</ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.eventItem}>
            <ThemedText type="smallBold">Submission Deadline</ThemedText>
            <ThemedText type="small">September 1, 2025</ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.eventItem}>
            <ThemedText type="smallBold">Hackathon Finals</ThemedText>
            <ThemedText type="small">October 23-24, 2025 - Cartagena, Colombia</ThemedText>
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
  eventItem: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    borderLeftWidth: 4,
    borderLeftColor: '#3c87f7',
  },
});
