import { useEffect, useRef, useState } from 'react';
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
  type ScrollViewInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  roleplayScenarios,
  sendRoleplayTurn,
  type RoleplayCorrection,
  type RoleplayScenario,
} from '../lib/aiService';

type Props = {
  onBack: () => void;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  corrections?: RoleplayCorrection[];
};

export function RoleplayChatScreen({ onBack }: Props) {
  const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollView = useRef<ScrollViewInstance>(null);
  const nextMessageId = useRef(0);
  const messageCount = messages.length;

  useEffect(() => {
    scrollView.current?.scrollToEnd({ animated: true });
  }, [messageCount]);

  function startScenario(selected: RoleplayScenario) {
    setScenario(selected);
    setMessages([
      {
        id: `greeting-${selected.id}`,
        role: 'assistant',
        text: selected.greeting,
      },
    ]);
    setErrorMessage('');
  }

  async function sendMessage() {
    const text = messageText.trim();
    if (!scenario || !text || sending) return;

    const userMessage: ChatMessage = {
      id: `message-${nextMessageId.current++}`,
      role: 'user',
      text,
    };
    setMessages((current) => [...current, userMessage]);
    setMessageText('');
    setErrorMessage('');
    setSending(true);

    try {
      const turn = await sendRoleplayTurn(scenario.id, text);
      setMessages((current) => [
        ...current,
        {
          id: `message-${nextMessageId.current++}`,
          role: 'assistant',
          text: turn.reply,
          corrections: turn.corrections,
        },
      ]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Không gửi được tin nhắn.',
      );
    } finally {
      setSending(false);
    }
  }

  function selectAnotherScenario() {
    setScenario(null);
    setMessages([]);
    setErrorMessage('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoiding}
      >
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Trang chủ</Text>
          </Pressable>
          <Text style={styles.title}>Luyện hội thoại</Text>
          <Text style={styles.mockLabel}>Mock AI · chưa gọi dịch vụ thật</Text>
          {scenario ? (
            <Pressable
              accessibilityRole="button"
              disabled={sending}
              onPress={selectAnotherScenario}
              style={styles.changeButton}
            >
              <Text style={styles.changeText}>Đổi tình huống</Text>
            </Pressable>
          ) : null}
        </View>

        {!scenario ? (
          <ScrollView contentContainerStyle={styles.scenarioList}>
            <Text style={styles.sectionTitle}>Chọn tình huống</Text>
            {roleplayScenarios.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item.id}
                onPress={() => startScenario(item)}
                style={({ pressed }) => [styles.scenarioCard, pressed && styles.pressed]}
              >
                <Text style={styles.scenarioTitle}>{item.title}</Text>
                <Text style={styles.scenarioDescription}>{item.description}</Text>
                <Text style={styles.startText}>Bắt đầu →</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.messages}
              ref={scrollView}
              style={styles.chat}
            >
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageGroup,
                    message.role === 'user' && styles.userMessageGroup,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                    ]}
                  >
                    <Text
                      style={
                        message.role === 'user'
                          ? styles.userMessageText
                          : styles.assistantMessageText
                      }
                    >
                      {message.text}
                    </Text>
                  </View>
                  {message.corrections?.map((correction, index) => (
                    <View
                      key={`${message.id}-correction-${index}`}
                      style={styles.correction}
                    >
                      <Text style={styles.correctionTitle}>Gợi ý diễn đạt</Text>
                      <Text style={styles.originalText}>Bạn viết: {correction.original}</Text>
                      <Text style={styles.correctedText}>
                        Tự nhiên hơn: {correction.corrected}
                      </Text>
                      <Text style={styles.explanation}>{correction.explanationVi}</Text>
                    </View>
                  ))}
                </View>
              ))}
              {sending ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#3157d5" />
                  <Text style={styles.loadingText}>Mock AI đang phản hồi…</Text>
                </View>
              ) : null}
            </ScrollView>

            {errorMessage ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {errorMessage}
              </Text>
            ) : null}
            <View style={styles.composer}>
              <TextInput
                accessibilityLabel="Tin nhắn tiếng Anh"
                editable={!sending}
                multiline
                onChangeText={setMessageText}
                onSubmitEditing={() => void sendMessage()}
                placeholder="Nhập câu trả lời bằng tiếng Anh…"
                placeholderTextColor="#727b8d"
                returnKeyType="send"
                style={styles.input}
                value={messageText}
              />
              <Pressable
                accessibilityLabel="Gửi tin nhắn"
                accessibilityRole="button"
                disabled={sending || !messageText.trim()}
                onPress={() => void sendMessage()}
                style={({ pressed }) => [
                  styles.sendButton,
                  (pressed || sending || !messageText.trim()) && styles.pressed,
                ]}
              >
                <Text style={styles.sendText}>{sending ? '…' : 'Gửi'}</Text>
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f4f6fb',
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  backText: {
    color: '#3157d5',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#15213b',
    fontSize: 25,
    fontWeight: '700',
    marginTop: 8,
  },
  mockLabel: {
    color: '#66738a',
    fontSize: 12,
    marginTop: 5,
  },
  changeButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
  },
  changeText: {
    color: '#3157d5',
    fontSize: 13,
    fontWeight: '600',
  },
  scenarioList: {
    gap: 14,
    padding: 20,
  },
  sectionTitle: {
    color: '#15213b',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 2,
  },
  scenarioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
  },
  scenarioTitle: {
    color: '#15213b',
    fontSize: 18,
    fontWeight: '700',
  },
  scenarioDescription: {
    color: '#536078',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  startText: {
    color: '#3157d5',
    fontWeight: '700',
    marginTop: 12,
  },
  pressed: {
    opacity: 0.65,
  },
  chat: {
    flex: 1,
  },
  messages: {
    gap: 14,
    padding: 16,
  },
  messageGroup: {
    alignItems: 'flex-start',
    maxWidth: '90%',
  },
  userMessageGroup: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
  },
  userBubble: {
    backgroundColor: '#3157d5',
  },
  assistantMessageText: {
    color: '#15213b',
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
  correction: {
    backgroundColor: '#fff3da',
    borderRadius: 12,
    marginTop: 8,
    padding: 12,
  },
  correctionTitle: {
    color: '#764900',
    fontSize: 13,
    fontWeight: '700',
  },
  originalText: {
    color: '#536078',
    fontSize: 13,
    marginTop: 6,
  },
  correctedText: {
    color: '#15213b',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  explanation: {
    color: '#536078',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    color: '#536078',
    fontSize: 13,
  },
  error: {
    color: '#a12525',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  composer: {
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    borderTopColor: '#e1e6f0',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  input: {
    backgroundColor: '#f7f8fc',
    borderColor: '#d9deeb',
    borderRadius: 12,
    borderWidth: 1,
    color: '#15213b',
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#3157d5',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 46,
    minWidth: 58,
  },
  sendText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
