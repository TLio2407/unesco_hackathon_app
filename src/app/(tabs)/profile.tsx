import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { PageContainer } from '@/components/page-container';

export default function ProfileScreen() {
  return (
    <PageContainer>
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
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginBottom: Spacing.two,
    marginTop: Spacing.two,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginTop: Spacing.two,
  },
});
