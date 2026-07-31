import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { createAnalyzeClient } from '@/api/client';
import type { AnalysisInput } from '@/api/contract';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { Spacing, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ScanScreen() {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      if (!permission) return;
      if (!permission.granted) {
        const { status } = await requestPermission();
        if (status !== 'granted') {
          Alert.alert(t('scan.noPermission'));
        }
      }
    })();
  }, [permission, requestPermission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
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
      setResult({ data, output });
    } catch {
      setError(t('scan.tryAgain'));
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>{t('scan.analyzing')}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centeredMaxWidth}>
          <Text style={[styles.errorText, { color: theme.riskHigh }]}>{t('scan.noPermission')}</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryAction }]} onPress={requestPermission}>
            <Text style={[styles.buttonText, { color: theme.primaryActionText }]}>{t('common.ok')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          <Ionicons name="qr-code" size={48} color={theme.primaryAction} />
          <Text style={[styles.scanHint, { color: '#FFF' }]}>{t('scan.hint')}</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={[styles.loadingText, { color: '#FFF' }]}>{t('scan.analyzing')}</Text>
        </View>
      )}

      {result && !loading && (
        <View style={styles.resultOverlay}>
          <View style={styles.centeredMaxWidth}>
            <Text style={[styles.resultTitle, { color: '#FFF' }]}>{t('scan.resultTitle')}</Text>

            <View style={styles.riskBadgeContainer}>
              <Text
                style={[
                  styles.riskBadge,
                  result.output.riskLevel === 'high_risk' && { backgroundColor: theme.riskHigh },
                  result.output.riskLevel === 'caution' && { backgroundColor: theme.riskCaution },
                  result.output.riskLevel === 'safe' && { backgroundColor: theme.riskSafe },
                  { color: '#FFF' }
                ]}>
                {t(`risk.${result.output.riskLevel}`)}
              </Text>
            </View>

            <Text style={[styles.resultDetail, { color: '#DDD' }]}>
              Dữ liệu: {result.data.substring(0, 50)}...
            </Text>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryAction }]} onPress={() => { setScanned(false); setResult(null); }}>
              <Text style={[styles.buttonText, { color: theme.primaryActionText }]}>{t('scan.scanAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorOverlay}>
          <View style={styles.centeredMaxWidth}>
            <Text style={[styles.errorText, { color: theme.riskHigh }]}>{error}</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryAction }]} onPress={() => { setError(null); setScanned(false); }}>
              <Text style={[styles.buttonText, { color: theme.primaryActionText }]}>{t('scan.tryAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredMaxWidth: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignItems: 'center',
    padding: Spacing.four,
  },
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
  loadingText: { fontSize: Accessibility.fontSize.large },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    marginBottom: Spacing.three,
    textAlign: 'center',
    fontSize: Accessibility.fontSize.xlarge,
    fontWeight: '700',
  },
  riskBadgeContainer: { marginBottom: Spacing.three },
  riskBadge: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    fontWeight: '700',
    fontSize: Accessibility.fontSize.large,
  },
  resultDetail: {
    marginBottom: Spacing.four,
    textAlign: 'center',
    fontSize: Accessibility.fontSize.normal,
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
  },
  errorText: {
    marginBottom: Spacing.three,
    textAlign: 'center',
    fontSize: Accessibility.fontSize.large,
    fontWeight: '700',
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    minWidth: 160,
  },
  buttonText: {
    fontSize: Accessibility.fontSize.large,
    fontWeight: '700',
    textAlign: 'center',
  },
});
