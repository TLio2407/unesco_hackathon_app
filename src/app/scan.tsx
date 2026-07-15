import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createAnalyzeClient } from '@/api/client';
import type { AnalysisInput } from '@/api/contract';
import { t } from '@/i18n';
import { Accessibility, Colors } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);
    setError(null);

    const client = createAnalyzeClient();
    const input: AnalysisInput = data.startsWith('http') 
      ? { kind: 'url', url: data } 
      : { kind: 'text', text: data };

    try {
      const output = await client.analyze(input);
      setResult({ type, data, output });
    } catch (e) {
      setError(t('scan.tryAgain'));
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.loadingText}>
          {t('scan.analyzing')}
        </ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="body" style={styles.errorText}>
          {t('scan.noPermission')}
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert(t('scan.noPermission'))}>
          <ThemedText style={styles.buttonText}>{t('common.ok')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <ThemedView style={styles.overlay}>
        <ThemedView style={styles.scanFrame}>
          <ThemedText style={styles.scanHint}>{t('scan.hint')}</ThemedText>
        </ThemedView>
      </ThemedView>

      {loading && (
        <ThemedView style={styles.loadingOverlay}>
          <ThemedText type="subtitle" style={styles.loadingText}>
            {t('scan.analyzing')}
          </ThemedText>
        </ThemedView>
      )}

      {result && !loading && (
        <ThemedView style={styles.resultOverlay}>
          <ThemedText type="subtitle" style={styles.resultTitle}>
            {t('scan.resultTitle')}
          </ThemedText>
          
          <ThemedView style={styles.riskBadgeContainer}>
            <ThemedText style={[
              styles.riskBadge,
              result.output.riskLevel === 'high_risk' && styles.riskHigh,
              result.output.riskLevel === 'caution' && styles.riskCaution,
              result.output.riskLevel === 'safe' && styles.riskSafe,
            ]}>
              {t(`risk.${result.output.riskLevel}`)}
            </ThemedText>
          </ThemedView>

          <ThemedText style={styles.resultDetail}>
            Loại: {result.type} | Dữ liệu: {result.data.substring(0, 50)}...
          </ThemedText>

          <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
            <ThemedText style={styles.buttonText}>{t('scan.scanAgain')}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {error && (
        <ThemedView style={styles.errorOverlay}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.button} onPress={() => { setError(null); setScanned(false); }}>
            <ThemedText style={styles.buttonText}>{t('scan.tryAgain')}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: {
    width: 280,
    height: 180,
    borderWidth: 3,
    borderColor: Colors.primaryAction,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  scanHint: {
    color: Colors.primaryActionText,
    fontSize: Accessibility.fontSize.normal,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing.two,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: Colors.primaryActionText },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  resultTitle: {
    color: Colors.primaryActionText,
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  riskBadgeContainer: { marginBottom: Spacing.three },
  riskBadge: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    fontWeight: '700',
    fontSize: Accessibility.fontSize.large,
  },
  riskHigh: { backgroundColor: Colors.riskHigh, color: Colors.riskHighText },
  riskCaution: { backgroundColor: Colors.riskCaution, color: Colors.riskCautionText },
  riskSafe: { backgroundColor: Colors.riskSafe, color: Colors.riskSafeText },
  resultDetail: {
    color: Colors.calmTextSecondary,
    marginBottom: Spacing.four,
    textAlign: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  errorText: {
    color: Colors.riskHigh,
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primaryAction,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    minWidth: 160,
  },
  buttonText: {
    color: Colors.primaryActionText,
    fontSize: Accessibility.fontSize.large,
    fontWeight: '700',
    textAlign: 'center',
  },
});
