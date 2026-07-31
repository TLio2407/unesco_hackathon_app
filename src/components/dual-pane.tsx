import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useResponsive } from '@/hooks/use-responsive';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface DualPaneProps {
  master: React.ReactNode;
  detail: React.ReactNode;
  masterFlex?: number;
  detailFlex?: number;
  containerStyle?: StyleProp<ViewStyle>;
  masterStyle?: StyleProp<ViewStyle>;
  detailStyle?: StyleProp<ViewStyle>;
  emptyDetailFallback?: React.ReactNode;
}

export function DualPane({
  master,
  detail,
  masterFlex = 1,
  detailFlex = 1.2,
  containerStyle,
  masterStyle,
  detailStyle,
}: DualPaneProps) {
  const { isWide } = useResponsive();
  const theme = useTheme();

  if (!isWide) {
    return (
      <View style={[styles.mobileContainer, containerStyle]}>
        <View style={masterStyle}>{master}</View>
        {detail ? <View style={[styles.mobileDetailWrapper, detailStyle]}>{detail}</View> : null}
      </View>
    );
  }

  return (
    <View style={[styles.wideContainer, containerStyle]}>
      <View style={[{ flex: masterFlex }, styles.pane, masterStyle]}>{master}</View>
      <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />
      <View style={[{ flex: detailFlex }, styles.pane, detailStyle]}>{detail}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    width: '100%',
    gap: Spacing.four,
  },
  mobileDetailWrapper: {
    marginTop: Spacing.three,
  },
  wideContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  pane: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: '100%',
    opacity: 0.5,
  },
});
