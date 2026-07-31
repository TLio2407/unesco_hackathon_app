import { useState } from 'react';
import { Pressable, StyleSheet, View, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PageContainer } from '@/components/page-container';
import { getDispatchHistory } from '@/lib/threat-feeds';

const MOCK_CONTACTS = [
  { id: '1', name: 'Con trai (Minh)', phone: '0901234567' },
  { id: '2', name: 'Cháu gái (Linh)', phone: '0987654321' },
];

export default function CircleScreen() {
  const theme = useTheme();
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const dispatchHistory = getDispatchHistory();

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
            setContacts(contacts.filter((c) => c.id !== id));
          },
        },
      ]
    );
  };

  return (
    <PageContainer>
      <ThemedText type="title" style={styles.title}>
        {t('circle.title')} (Vòng tròn Người thân)
      </ThemedText>

      <ThemedText style={styles.body}>{t('circle.placeholder')}</ThemedText>

      <View style={styles.contactsList}>
        {contacts.map((contact) => (
          <ThemedView key={contact.id} type="backgroundElement" style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <Ionicons name="person-circle" size={48} color={theme.primaryAction} />
              <View>
                <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                <ThemedText style={[styles.contactPhone, { color: theme.textSecondary }]}>
                  {contact.phone}
                </ThemedText>
              </View>
            </View>
            <View style={styles.cardActions}>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: theme.primaryAction }]}
                accessibilityRole="button"
                accessibilityLabel={`Nhắn tin cho ${contact.name}`}>
                <Ionicons name="chatbubble-ellipses" size={24} color={theme.primaryActionText} />
              </Pressable>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: theme.riskHigh }]}
                onPress={() => handleDelete(contact.id)}
                accessibilityRole="button"
                accessibilityLabel={`Xóa ${contact.name}`}>
                <Ionicons name="trash" size={24} color="#FFF" />
              </Pressable>
            </View>
          </ThemedView>
        ))}
      </View>

      <Pressable
        style={[styles.addBtn, { backgroundColor: theme.primaryAction }]}
        onPress={() => setIsModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Thêm người thân mới">
        <Ionicons name="add-circle" size={28} color={theme.primaryActionText} />
        <ThemedText style={[styles.addBtnText, { color: theme.primaryActionText }]}>
          {t('circle.addContact')}
        </ThemedText>
      </Pressable>

      <View style={[styles.privacyNote, { backgroundColor: theme.riskSafeBg, borderColor: theme.riskSafe }]}>
        <Ionicons name="shield-checkmark" size={24} color={theme.riskSafe} />
        <ThemedText style={[styles.privacyText, { color: theme.textSecondary }]}>
          {t('circle.redactedNotice')}
        </ThemedText>
      </View>

      {/* Dispatch History */}
      {dispatchHistory.length > 0 && (
        <View style={styles.historySection}>
          <ThemedText type="subtitle" style={styles.historyTitle}>
            Lịch sử Cảnh báo đã gửi gần đây ({dispatchHistory.length})
          </ThemedText>
          {dispatchHistory.map((item) => (
            <ThemedView key={item.id} type="backgroundElement" style={styles.historyCard}>
              <Ionicons name="megaphone-outline" size={24} color={theme.primaryAction} />
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.historyAlertTitle}>{item.alertTitle}</ThemedText>
                <ThemedText style={[styles.historyMeta, { color: theme.textSecondary }]}>
                  Đã gửi đến {item.recipientsCount} người thân • {new Date(item.dispatchedAt).toLocaleTimeString()}
                </ThemedText>
              </View>
            </ThemedView>
          ))}
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: theme.surfaceCard, borderColor: theme.cardBorder }]}>
            <ThemedText style={styles.modalTitle}>{t('circle.addContactTitle')}</ThemedText>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>{t('circle.nameLabel')}</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder, color: theme.text }]}
                value={newName}
                onChangeText={setNewName}
                placeholder={t('circle.namePlaceholder')}
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>{t('circle.phoneLabel')}</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder, color: theme.text }]}
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder={t('circle.phonePlaceholder')}
                keyboardType="phone-pad"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.backgroundElement }]}
                onPress={() => setIsModalVisible(false)}>
                <ThemedText style={[styles.cancelButtonText, { color: theme.text }]}>
                  {t('common.cancel')}
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.primaryAction }]}
                onPress={handleAdd}>
                <ThemedText style={[styles.confirmButtonText, { color: theme.primaryActionText }]}>
                  {t('common.confirm')}
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: Accessibility.fontSize.title, marginBottom: Spacing.two },
  body: {
    fontSize: Accessibility.fontSize.normal,
    lineHeight: 28,
  },
  contactsList: { gap: Spacing.three, marginTop: Spacing.two },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  contactInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  contactName: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  contactPhone: { fontSize: Accessibility.fontSize.normal },
  cardActions: { flexDirection: 'row', gap: Spacing.two },
  actionBtn: {
    padding: Spacing.two,
    borderRadius: Spacing.three,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: Accessibility.minTouchSize,
    marginTop: Spacing.two,
  },
  addBtnText: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1,
    marginTop: Spacing.two,
  },
  privacyText: { flex: 1, fontSize: Accessibility.fontSize.small },
  historySection: { marginTop: Spacing.four, gap: Spacing.two },
  historyTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  historyAlertTitle: { fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  historyMeta: { fontSize: Accessibility.fontSize.small },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    borderWidth: 1,
    elevation: 5,
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
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: Accessibility.fontSize.normal,
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
  cancelButtonText: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
  },
});
