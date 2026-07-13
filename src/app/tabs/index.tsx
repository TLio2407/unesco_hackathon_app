import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AICompanionScreen() {
  const [inputText, setInputText] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Bạn đang nghi ngờ điều gì?</Text>
        <Text style={styles.subtitle}>Gửi tin nhắn, hình ảnh hoặc link để AI kiểm tra giúp bạn nhé.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Dán link hoặc nhập nội dung..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          {/* Voice Input Button - FR04 */}
          <TouchableOpacity style={styles.voiceButton}>
            <Ionicons name="mic" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.analyzeButton}>
            <Text style={styles.buttonText}>Phân tích ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Placeholder for AI Result (FR11, FR12, FR13) */}
        <View style={styles.resultCard}>
           <Text style={styles.resultTitle}>⚠️ Kết quả phân tích:</Text>
           <Text style={styles.resultText}>Đây có thể là tin nhắn giả mạo ngân hàng. Không được bấm vào đường link!</Text>
           
           {/* Share to Trusted Circle Button - FR13 */}
           <TouchableOpacity style={styles.shareButton}>
             <Ionicons name="share-social" size={20} color="#FFF" />
             <Text style={styles.shareText}>Chia sẻ cho người thân</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 15, fontSize: 18, minHeight: 60, borderColor: '#DDD', borderWidth: 1 },
  voiceButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 12, marginLeft: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'center' },
  analyzeButton: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, width: '100%', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  resultCard: { marginTop: 30, backgroundColor: '#FFF', padding: 20, borderRadius: 15, borderColor: '#FFE0E0', borderWidth: 2 },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10 },
  resultText: { fontSize: 18, lineHeight: 28, color: '#333', marginBottom: 20 },
  shareButton: { backgroundColor: '#34C759', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10 },
  shareText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});