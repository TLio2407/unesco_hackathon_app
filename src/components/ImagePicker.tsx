import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './themed-text';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { t } from '@/i18n';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  disabled?: boolean;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ImagePickerButton({ onImageSelected, disabled, active, style }: ImagePickerProps) {
  const theme = useTheme();

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
        { borderColor: theme.primaryAction, backgroundColor: theme.surfaceCard },
        active && { backgroundColor: theme.primaryAction },
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={pickImage}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={t('companion.sourceImage')}>
      <Ionicons
        name="image-outline"
        size={32}
        color={active ? theme.primaryActionText : theme.primaryAction}
      />
      <ThemedText style={[styles.label, active && { color: theme.primaryActionText }]}>
        {t('companion.sourceImage')}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    borderWidth: 2,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
    textAlign: 'center',
  },
});
