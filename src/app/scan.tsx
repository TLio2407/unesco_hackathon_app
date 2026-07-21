import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t('scan.analyzing')}</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('scan.noPermission')}</Text>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert(t('scan.noPermission'))}>
          <Text style={styles.buttonText}>{t('common.ok')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          <Ionicons name="qr-code" size={48} color={Colors.primaryAction} />
          <Text style={styles.scanHint}>{t('scan.hint')}</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>{t('scan.analyzing')}</Text>
        </View>
      )}

      {result && !loading && (
        <View style={styles.resultOverlay}>
          <Text style={styles.resultTitle}>{t('scan.resultTitle')}</Text>

          <View style={styles.riskBadgeContainer}>
            <Text
              style={[
                styles.riskBadge,
                result.output.riskLevel === 'high_risk' && styles.riskHigh,
                result.output.riskLevel === 'caution' && styles.riskCaution,
                result.output.riskLevel === 'safe' && styles.riskSafe,
              ]}>
              {t(`risk.${result.output.riskLevel}`)}
            </Text>
          </View>

          <Text style={styles.resultDetail}>
            Loại: {result.type} | Dữ liệu: {result.data.substring(0, 50)}...
          </Text>

          <TouchableOpacity style={styles.button} onPress={() => { setScanned(false); setResult(null); }}>
            <Text style={styles.buttonText}>{t('scan.scanAgain')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => { setError(null); setScanned(false); }}>
            <Text style={styles.buttonText}>{t('scan.tryAgain')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  scanFrame: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  scanHint: {
    fontSize: Accessibility.fontSize.normal,
    color: Colors.primaryActionText,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: Colors.primaryActionText },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  riskHigh: { backgroundColor: Colors.riskHigh, color: '#FFFFFF' },
  riskCaution: { backgroundColor: Colors.riskCaution, color: '#FFFFFF' },
  riskSafe: { backgroundColor: Colors.riskSafe, color: '#FFFFFF' },
  resultDetail: {
    color: Colors.calmTextSecondary,
    marginBottom: Spacing.four,
    textAlign: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  loadingText: { color: Colors.primaryActionText },
});