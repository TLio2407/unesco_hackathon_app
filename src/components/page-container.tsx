import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaxContentWidth, Spacing, BottomTabInset } from '@/constants/theme';
import { ThemedView } from './themed-view';

interface PageContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

export function PageContainer({
  children,
  style,
  contentContainerStyle,
  scrollable = true,
}: PageContainerProps) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > MaxContentWidth;

  const containerStyle = [
    styles.container,
    style,
  ];

  const contentStyle = [
    styles.content,
    isLargeScreen && styles.centeredContent,
    contentContainerStyle,
  ];

  if (scrollable) {
    return (
      <ThemedView style={containerStyle}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={contentStyle}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={containerStyle}>
      <SafeAreaView style={styles.safe}>
        <View style={contentStyle}>
          {children}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    width: '100%',
    paddingBottom: BottomTabInset + Spacing.five,
  },
  centeredContent: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
