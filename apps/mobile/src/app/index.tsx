import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Session } from '@supabase/supabase-js';

import { HomeDashboard } from '../components/HomeDashboard';
import { supabase } from '../lib/supabase';

export default function SignInScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [validatedUserId, setValidatedUserId] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setValidatedUserId(null);
        setSession(nextSession);
        setAuthLoading(false);
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setErrorMessage(error.message);
        } else {
          setValidatedUserId(null);
          setSession(data.session);
        }
        setAuthLoading(false);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setErrorMessage(
          cause instanceof Error ? cause.message : 'Không thể khôi phục phiên đăng nhập.',
        );
        setAuthLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session) return;

    let active = true;
    void supabase.auth
      .getClaims(session.access_token)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setErrorMessage(error.message);
          return;
        }
        if (
          !data ||
          typeof data.claims.sub !== 'string' ||
          data.claims.sub !== session.user.id
        ) {
          setErrorMessage('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
          return;
        }
        setErrorMessage('');
        setValidatedUserId(session.user.id);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setErrorMessage(
          cause instanceof Error ? cause.message : 'Không thể xác thực phiên đăng nhập.',
        );
      });

    return () => {
      active = false;
    };
  }, [session]);

  const sessionValidated = Boolean(
    session && validatedUserId === session.user.id,
  );

  async function submitAuth() {
    if (!supabase) return;

    setBusy(true);
    setErrorMessage('');
    setNotice('');
    try {
      const result = isSignUp
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: displayName.trim()
                ? { display_name: displayName.trim() }
                : {},
            },
          })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (isSignUp && !result.data.session) {
        setNotice('Hãy kiểm tra email để xác nhận tài khoản trước khi đăng nhập.');
      }
    } catch (cause: unknown) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Không thể kết nối dịch vụ đăng nhập.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (!supabase) return;

    setBusy(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setErrorMessage(error.message);
    } catch (cause: unknown) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Không thể đăng xuất.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (session && sessionValidated) {
    return <HomeDashboard session={session} signOut={signOut} busy={busy} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.eyebrow}>LANGUAGE LEARNING</Text>
          <Text style={styles.title}>
            {authLoading || (session && !sessionValidated && !errorMessage)
              ? 'Đang tải phiên…'
              : isSignUp
                ? 'Tạo tài khoản'
                : 'Đăng nhập'}
          </Text>

          {authLoading || (session && !sessionValidated && !errorMessage) ? (
            <ActivityIndicator accessibilityLabel="Đang tải" color="#3157d5" />
          ) : !supabase ? (
            <Text accessibilityRole="alert" style={styles.error}>
              Chưa cấu hình Supabase. Tạo tệp .env từ .env.example rồi khởi động lại Expo.
            </Text>
          ) : (
            <View style={styles.panel}>
              {isSignUp ? (
                <TextInput
                  accessibilityLabel="Tên hiển thị"
                  autoCapitalize="words"
                  onChangeText={setDisplayName}
                  placeholder="Tên hiển thị (không bắt buộc)"
                  placeholderTextColor="#727b8d"
                  style={styles.input}
                  value={displayName}
                />
              ) : null}
              <TextInput
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#727b8d"
                style={styles.input}
                textContentType="emailAddress"
                value={email}
              />
              <TextInput
                accessibilityLabel="Mật khẩu"
                autoCapitalize="none"
                autoComplete={isSignUp ? 'new-password' : 'password'}
                onChangeText={setPassword}
                placeholder="Mật khẩu"
                placeholderTextColor="#727b8d"
                secureTextEntry
                style={styles.input}
                textContentType={isSignUp ? 'newPassword' : 'password'}
                value={password}
              />
              {errorMessage ? (
                <Text accessibilityRole="alert" style={styles.error}>
                  {errorMessage}
                </Text>
              ) : null}
              {notice ? <Text style={styles.notice}>{notice}</Text> : null}
              <Button
                label={busy ? 'Đang xử lý…' : isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
                disabled={busy || !email.trim() || !password}
                onPress={submitAuth}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsSignUp((current) => !current);
                  setErrorMessage('');
                  setNotice('');
                }}
                style={styles.modeButton}
              >
                <Text style={styles.modeText}>
                  {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ButtonProps = {
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

function Button({ label, disabled = false, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        (disabled || pressed) && styles.buttonMuted,
      ]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f4f6fb',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  eyebrow: {
    color: '#3157d5',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  title: {
    color: '#15213b',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    gap: 14,
    padding: 20,
  },
  body: {
    color: '#536078',
    fontSize: 14,
  },
  email: {
    color: '#15213b',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f7f8fc',
    borderColor: '#d9deeb',
    borderRadius: 10,
    borderWidth: 1,
    color: '#15213b',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#3157d5',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 4,
  },
  buttonMuted: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  modeText: {
    color: '#3157d5',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#a12525',
    fontSize: 14,
  },
  notice: {
    color: '#3157d5',
    fontSize: 14,
  },
});
