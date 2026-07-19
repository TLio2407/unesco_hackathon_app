import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './themed-text';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  disabled?: boolean;
}

export function ImagePickerButton({ onImageSelected, disabled }: ImagePickerProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={pickImage}
      disabled={disabled}>
      <Ionicons name="image" size={32} color={Accessibility.colors.primaryAction} />
      <ThemedText style={styles.label}>{t('companion.sourceImage')}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: Accessibility.minTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderColor: Accessibility.colors.primaryAction,
    backgroundColor: Accessibility.colors.surfaceCard,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
    color: Accessibility.colors.calmText,
  },
});
