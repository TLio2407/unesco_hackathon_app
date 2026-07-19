import { useState } from 'react';
import { Pressable, Share, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { redact } from '@/lib/redact';
import { Accessibility } from '@/theme/tokens';
import { MaxContentWidth, Spacing } from '@/constants/theme';

// Mock trusted contacts
const MOCK_CONTACTS = [
  { id: '1', name: 'Con trai (Minh)', relation: 'Con ruột' },
  { id: '2', name: 'Cháu gái (Linh)', relation: 'Cháu' },
];

export default function CircleScreen() {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {t('circle.title')}
          </ThemedText>

          <ThemedText style={styles.body}>
            {t('circle.placeholder')}
          </ThemedText>

          <View style={styles.contactsList}>
            {contacts.map(contact => (
              <ThemedView key={contact.id} type="backgroundElement" style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <Ionicons name="person-circle" size={40} color={Accessibility.colors.primaryAction} />
                  <View>
                    <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                    <ThemedText style={styles.contactRelation}>{contact.relation}</ThemedText>
                  </View>
                </View>
                <Pressable style={styles.actionBtn}>
                  <Ionicons name="chatbubble-ellipses" size={24} color={Accessibility.colors.primaryActionText} />
                </Pressable>
              </ThemedView>
            ))}
          </View>

          <Pressable style={styles.addBtn}>
            <Ionicons name="add-circle" size={28} color={Accessibility.colors.primaryActionText} />
            <ThemedText style={styles.addBtnText}>Thêm người thân</ThemedText>
          </Pressable>

          <ThemedView type="backgroundElement" style={styles.privacyNote}>
            <Ionicons name="shield-checkmark" size={24} color={Accessibility.colors.riskSafe} />
            <ThemedText style={styles.privacyText}>
              {t('circle.redactedNotice')}
            </ThemedText>
          </ThemedView>
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
  body: {
    fontSize: Accessibility.fontSize.normal,
    lineHeight: 28,
    color: Accessibility.colors.calmText,
  },
  contactsList: { gap: Spacing.three },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  contactInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  contactName: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  contactRelation: { fontSize: Accessibility.fontSize.normal, color: Accessibility.colors.calmTextSecondary },
  actionBtn: {
    backgroundColor: Accessibility.colors.primaryAction,
    padding: Spacing.two,
    borderRadius: Spacing.three,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: Accessibility.colors.primaryAction,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  addBtnText: { color: Accessibility.colors.primaryActionText, fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: '#F0F9F4',
  },
  privacyText: { flex: 1, fontSize: Accessibility.fontSize.small, color: Accessibility.colors.calmTextSecondary },
});
