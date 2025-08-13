import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Database pertanyaan dan jawaban kesehatan
const healthKnowledgeBase = {
  // Gejala umum
  'demam': {
    keywords: ['demam', 'panas', 'suhu tinggi', 'meriang'],
    response: 'Demam adalah kondisi suhu tubuh di atas normal (37°C). Tips:\n• Istirahat yang cukup\n• Minum banyak air putih\n• Kompres dengan air hangat\n• Jika demam tinggi (>39°C) atau berlangsung >3 hari, segera ke dokter'
  },
  'batuk': {
    keywords: ['batuk', 'batuk kering', 'batuk berdahak'],
    response: 'Batuk bisa disebabkan oleh infeksi saluran napas, alergi, atau iritasi. Tips:\n• Minum madu dengan air hangat\n• Hindari makanan pedas dan berminyak\n• Gunakan humidifier\n• Jika batuk berdarah atau >2 minggu, konsultasi dokter'
  },
  'sakit kepala': {
    keywords: ['sakit kepala', 'pusing', 'migrain', 'nyeri kepala'],
    response: 'Sakit kepala bisa disebabkan stres, kurang tidur, atau masalah kesehatan. Tips:\n• Istirahat di ruangan gelap dan tenang\n• Pijat lembut area pelipis\n• Minum air putih yang cukup\n• Jika sakit parah atau disertai gejala lain, segera ke dokter'
  },
  'mual': {
    keywords: ['mual', 'muntah', 'perut mual', 'mual muntah'],
    response: 'Mual bisa disebabkan infeksi, keracunan makanan, atau masalah pencernaan. Tips:\n• Makan dalam porsi kecil dan sering\n• Hindari makanan berlemak dan pedas\n• Minum jahe atau teh peppermint\n• Jika muntah terus-menerus, segera ke dokter'
  },
  'diare': {
    keywords: ['diare', 'mencret', 'buang air besar cair'],
    response: 'Diare bisa menyebabkan dehidrasi. Tips:\n• Minum banyak air putih atau oralit\n• Makan makanan lunak (bubur, pisang)\n• Hindari susu dan makanan berminyak\n• Jika diare berdarah atau >3 hari, konsultasi dokter'
  },
  'insomnia': {
    keywords: ['insomnia', 'sulit tidur', 'tidak bisa tidur', 'gangguan tidur'],
    response: 'Insomnia bisa mempengaruhi kesehatan. Tips:\n• Buat jadwal tidur teratur\n• Hindari kafein dan gadget sebelum tidur\n• Buat suasana kamar nyaman dan gelap\n• Lakukan relaksasi atau meditasi\n• Jika berlangsung lama, konsultasi dokter'
  },
  'nyeri sendi': {
    keywords: ['nyeri sendi', 'sakit sendi', 'radang sendi', 'arthritis'],
    response: 'Nyeri sendi bisa disebabkan peradangan atau cedera. Tips:\n• Kompres hangat untuk mengurangi nyeri\n• Istirahatkan sendi yang sakit\n• Lakukan peregangan ringan\n• Konsumsi makanan anti-inflamasi\n• Jika nyeri parah, konsultasi dokter'
  },
  'tekanan darah tinggi': {
    keywords: ['tekanan darah tinggi', 'hipertensi', 'darah tinggi'],
    response: 'Hipertensi adalah tekanan darah >140/90 mmHg. Tips:\n• Kurangi konsumsi garam\n• Olahraga teratur 30 menit/hari\n• Konsumsi makanan rendah lemak\n• Hindari rokok dan alkohol\n• Monitor tekanan darah secara rutin'
  },
  'diabetes': {
    keywords: ['diabetes', 'gula darah tinggi', 'kencing manis'],
    response: 'Diabetes memerlukan pengelolaan yang baik. Tips:\n• Kontrol gula darah secara rutin\n• Diet rendah karbohidrat dan gula\n• Olahraga teratur\n• Minum obat sesuai anjuran dokter\n• Periksa kaki setiap hari'
  },
  'asma': {
    keywords: ['asma', 'sesak napas', 'mengi', 'wheezing'],
    response: 'Asma adalah peradangan saluran napas. Tips:\n• Hindari pemicu (debu, asap, alergen)\n• Gunakan inhaler sesuai resep\n• Olahraga ringan secara teratur\n• Jaga kebersihan rumah\n• Jika serangan parah, segera ke UGD'
  }
};

// Pertanyaan umum
const generalQuestions = [
  'Apa gejala COVID-19?',
  'Bagaimana cara menurunkan demam?',
  'Makanan apa yang baik untuk sakit perut?',
  'Kapan harus ke dokter?',
  'Bagaimana cara mencegah flu?'
];

export function MedicalConsultation({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Halo! Saya adalah asisten kesehatan virtual. Saya bisa membantu menjawab pertanyaan umum tentang kesehatan. Silakan tanyakan gejala atau masalah kesehatan Anda.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto-scroll ke pesan terbaru
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const findBestMatch = (userInput: string): string | null => {
    const input = userInput.toLowerCase();
    
    // Cari match berdasarkan keywords
    for (const [topic, data] of Object.entries(healthKnowledgeBase)) {
      for (const keyword of data.keywords) {
        if (input.includes(keyword)) {
          return topic;
        }
      }
    }
    
    return null;
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Cek pertanyaan spesifik
    if (input.includes('covid') || input.includes('corona')) {
      return 'Gejala COVID-19 yang umum:\n• Demam atau menggigil\n• Batuk kering\n• Kelelahan\n• Kehilangan indra penciuman/pengecapan\n• Sakit tenggorokan\n• Sesak napas\n\nJika mengalami gejala parah, segera ke rumah sakit!';
    }
    
    if (input.includes('flu') || input.includes('pilek')) {
      return 'Cara mencegah flu:\n• Cuci tangan dengan sabun\n• Hindari menyentuh wajah\n• Konsumsi vitamin C\n• Istirahat yang cukup\n• Jaga jarak dari orang sakit\n• Gunakan masker jika diperlukan';
    }
    
    if (input.includes('sakit perut') || input.includes('maag')) {
      return 'Makanan yang baik untuk sakit perut:\n• Bubur atau nasi putih\n• Pisang\n• Apel\n• Jahe\n• Teh chamomile\n• Yogurt\n\nHindari makanan pedas, asam, dan berlemak!';
    }
    
    if (input.includes('kapan') && input.includes('dokter')) {
      return 'Segera ke dokter jika mengalami:\n• Demam tinggi >39°C\n• Nyeri dada atau sesak napas\n• Pendarahan yang tidak berhenti\n• Kehilangan kesadaran\n• Gejala yang memburuk dalam 24-48 jam';
    }
    
    // Cari match berdasarkan keywords
    const matchedTopic = findBestMatch(userInput);
    if (matchedTopic) {
      return healthKnowledgeBase[matchedTopic as keyof typeof healthKnowledgeBase].response;
    }
    
    // Default response
    return 'Maaf, saya tidak yakin dengan pertanyaan Anda. Silakan tanyakan tentang:\n• Gejala penyakit umum (demam, batuk, sakit kepala)\n• Tips kesehatan\n• Kapan harus ke dokter\n\nAtau gunakan pertanyaan yang lebih spesifik.';
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: ChatMessage = {
      id: String(Date.now()),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulasi delay typing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const botResponse = generateResponse(userMessage.text);
    const botMessage: ChatMessage = {
      id: String(Date.now() + 1),
      text: botResponse,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <ThemedText style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.botMessageText
      ]}>
        {item.text}
      </ThemedText>
      <ThemedText style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Konsultasi Medis</ThemedText>
        <View style={{ width: 40 }} />
      </ThemedView>

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        
        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={Colors.light.primary} />
            <ThemedText style={styles.typingText}>Bot sedang mengetik...</ThemedText>
          </View>
        )}
      </View>

      {/* Quick Questions */}
      <View style={styles.quickQuestionsContainer}>
        <ThemedText style={styles.quickQuestionsTitle}>Pertanyaan Umum:</ThemedText>
        <View style={styles.quickQuestionsList}>
          {generalQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionBtn}
              onPress={() => handleQuickQuestion(question)}
            >
              <ThemedText style={styles.quickQuestionText}>{question}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Tanyakan gejala atau masalah kesehatan Anda..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? '#fff' : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.light.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  
  chatContainer: { flex: 1 },
  messagesList: { padding: 16 },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: Colors.light.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  
  quickQuestionsContainer: {
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.textSecondary,
  },
  quickQuestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickQuestionBtn: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  quickQuestionText: {
    fontSize: 12,
    color: Colors.light.primary,
  },
  
  inputContainer: {
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
});


