import { useState } from 'react';
import { Pressable, StyleSheet, ScrollView, View, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { MaxContentWidth, Spacing } from '@/constants/theme';

// Mock trusted contacts - updated to include phone numbers per request
const MOCK_CONTACTS = [
  { id: '1', name: 'Con trai (Minh)', phone: '0901234567' },
  { id: '2', name: 'Cháu gái (Linh)', phone: '0987654321' },
];

export default function CircleScreen() {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert(t('common.error'), 'Vui lòng nhập đầy đủ họ tên và số điện thoại');
      return;
    }
    const newContact = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim(),
    };
    setContacts([...contacts, newContact]);
    setNewName('');
    setNewPhone('');
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      t('circle.deleteTitle'),
      t('circle.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            setContacts(contacts.filter(c => c.id !== id));
          }
        },
      ]
    );
  };

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
                  <Ionicons name="person-circle" size={48} color={Accessibility.colors.primaryAction} />
                  <View>
                    <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                    <ThemedText style={styles.contactPhone}>{contact.phone}</ThemedText>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <Pressable style={styles.actionBtn}>
                    <Ionicons name="chatbubble-ellipses" size={24} color={Accessibility.colors.primaryActionText} />
                  </Pressable>
                  <Pressable
                    style={[styles.actionBtn, { backgroundColor: Accessibility.colors.riskHigh }]}
                    onPress={() => handleDelete(contact.id)}
                  >
                    <Ionicons name="trash" size={24} color={Accessibility.colors.primaryActionText} />
                  </Pressable>
                </View>
              </ThemedView>
            ))}
          </View>

          <Pressable style={styles.addBtn} onPress={() => setIsModalVisible(true)}>
            <Ionicons name="add-circle" size={28} color={Accessibility.colors.primaryActionText} />
            <ThemedText style={styles.addBtnText}>{t('circle.addContact')}</ThemedText>
          </Pressable>

          <ThemedView type="backgroundElement" style={styles.privacyNote}>
            <Ionicons name="shield-checkmark" size={24} color={Accessibility.colors.riskSafe} />
            <ThemedText style={styles.privacyText}>
              {t('circle.redactedNotice')}
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView type="backgroundElement" style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>{t('circle.addContactTitle')}</ThemedText>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>{t('circle.nameLabel')}</ThemedText>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder={t('circle.namePlaceholder')}
                placeholderTextColor={Accessibility.colors.calmTextSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>{t('circle.phoneLabel')}</ThemedText>
              <TextInput
                style={styles.input}
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder={t('circle.phonePlaceholder')}
                keyboardType="phone-pad"
                placeholderTextColor={Accessibility.colors.calmTextSecondary}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <ThemedText style={styles.cancelButtonText}>{t('common.cancel')}</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAdd}
              >
                <ThemedText style={styles.confirmButtonText}>{t('common.confirm')}</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
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
  contactPhone: { fontSize: Accessibility.fontSize.normal, color: Accessibility.colors.calmTextSecondary },
  cardActions: { flexDirection: 'row', gap: Spacing.two },
  actionBtn: {
    backgroundColor: Accessibility.colors.primaryAction,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: Accessibility.colors.primaryAction,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: Accessibility.minTouchSize,
  },
  addBtnText: { color: Accessibility.colors.primaryActionText, fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: Accessibility.colors.successBackground,
  },
  privacyText: { flex: 1, fontSize: Accessibility.fontSize.small, color: Accessibility.colors.calmTextSecondary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.four,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: Accessibility.fontSize.large,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputContainer: { gap: Spacing.one },
  inputLabel: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: Accessibility.fontSize.normal,
    backgroundColor: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Accessibility.minTouchSize,
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  confirmButton: {
    backgroundColor: Accessibility.colors.primaryAction,
  },
  cancelButtonText: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
    color: Accessibility.colors.calmText,
  },
  confirmButtonText: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
    color: Accessibility.colors.primaryActionText,
  },
});
