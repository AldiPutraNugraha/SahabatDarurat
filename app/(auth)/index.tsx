import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await signIn(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Gagal Masuk', err?.message ?? 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || isLoading || !email || !password;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={{ color: Colors.light.primary }}>SahabatDarurat</ThemedText>
          <ThemedText type="subtitle" style={{ color: Colors.light.textSecondary }}>Masuk dulu ya, biar aman</ThemedText>
        </View>

        <View style={styles.form}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            placeholderTextColor={Colors.light.textMuted}
          />

          <ThemedText style={[styles.label, { marginTop: 16 }]}>Password</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            style={styles.input}
            placeholderTextColor={Colors.light.textMuted}
          />

          <Pressable onPress={onSubmit} disabled={disabled} style={({ pressed }) => [
            styles.button,
            disabled ? styles.buttonDisabled : undefined,
            pressed ? { opacity: 0.9 } : undefined,
          ]}>
            <ThemedText style={styles.buttonText}>{disabled ? 'Sebentar...' : 'Masuk'}</ThemedText>
          </Pressable>

          <ThemedText style={styles.hint}>Tips: isi bebas aja untuk coba.</ThemedText>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingTop: 80,
    gap: 24,
  },
  header: {
    gap: 6,
  },
  form: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    color: Colors.light.textSecondary,
  },
  input: {
    marginTop: 6,
    backgroundColor: Colors.light.surfaceVariant,
    borderColor: Colors.light.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: Colors.light.text,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.light.primaryLight,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  hint: {
    marginTop: 12,
    textAlign: 'center',
    color: Colors.light.textMuted,
  },
});


