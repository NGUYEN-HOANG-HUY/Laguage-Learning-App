import type {
  ConversationScenario,
  RoleplayCorrection,
  RoleplayMessage,
  RoleplayTurn,
} from '../types/learning.ts';

export type RoleplayScenarioOption = {
  id: ConversationScenario;
  title: string;
  description: string;
  greeting: string;
};

export const roleplayScenarios: readonly RoleplayScenarioOption[] = [
  {
    id: 'restaurant',
    title: 'Gọi món',
    description: 'Gọi món và trao đổi lịch sự với nhân viên nhà hàng.',
    greeting: 'Hello! Welcome in. Would you like to see the menu?',
  },
  {
    id: 'interview',
    title: 'Phỏng vấn',
    description: 'Giới thiệu kinh nghiệm và điểm mạnh của bạn.',
    greeting: 'Thanks for coming in. Could you tell me about your experience?',
  },
  {
    id: 'office',
    title: 'Giao tiếp công sở',
    description: 'Trao đổi về cuộc họp, khách hàng và công việc.',
    greeting: 'Good morning! What is your main priority today?',
  },
];

const MAX_MESSAGE_LENGTH = 2000;

const correctionRules: {
  pattern: RegExp;
  corrected: (match: RegExpMatchArray) => string;
  explanationVi: string;
}[] = [
  {
    pattern: /\bI am agree\b/i,
    corrected: () => 'I agree',
    explanationVi: '“Agree” là động từ nên không dùng “am” ở trước.',
  },
  {
    pattern: /\bI want order\b/i,
    corrected: () => "I'd like to order",
    explanationVi: 'Dùng “want to + verb”; “I’d like” lịch sự hơn khi gọi món.',
  },
  {
    pattern: /\bI very like\b/i,
    corrected: () => 'I really like',
    explanationVi: 'Trong tiếng Anh, “really” thường đứng trước động từ “like”.',
  },
  {
    pattern: /\b(he|she|it) go\b/i,
    corrected: (match) => `${match[1][0].toUpperCase()}${match[1].slice(1)} goes`,
    explanationVi: 'Ở hiện tại đơn, động từ đi với he/she/it thường thêm “-s”.',
  },
];

function getCorrections(message: string): RoleplayCorrection[] {
  const corrections: RoleplayCorrection[] = [];

  for (const rule of correctionRules) {
    if (corrections.length === 2) break;
    const match = message.match(rule.pattern);
    if (!match) continue;

    corrections.push({
      original: match[0],
      corrected: rule.corrected(match),
      explanationVi: rule.explanationVi,
    });
  }

  return corrections;
}

function getContextText(
  message: string,
  history: readonly RoleplayMessage[],
): string {
  return [...history.slice(-6).map((entry) => entry.text), message]
    .join(' ')
    .toLowerCase();
}

function getReply(
  scenario: ConversationScenario,
  contextText: string,
): string {
  if (scenario === 'restaurant') {
    if (/\b(bill|check)\b/.test(contextText)) {
      return 'Of course. Would you like anything else before I bring the bill?';
    }
    if (/\b(vegetarian|vegan|recommend|suggest)\b/.test(contextText)) {
      return 'Our vegetable soup is a popular choice. Would you like to hear about another dish?';
    }
    if (/\b(order|chicken|fish|salad|sandwich)\b/.test(contextText)) {
      return 'Great choice. Would you like a side dish or something to drink?';
    }
    if (/\b(drink|water|coffee|tea)\b/.test(contextText)) {
      return 'Certainly. Would you prefer water, tea, or coffee?';
    }
    return 'Would you like to order now, or do you need a little more time?';
  }

  if (scenario === 'interview') {
    if (/\b(experience|worked|work)\b/.test(contextText)) {
      return 'Which accomplishment from that experience are you most proud of?';
    }
    if (/\b(strength|skill|good at)\b/.test(contextText)) {
      return 'Could you share a recent example that shows this strength?';
    }
    if (/\b(challenge|weakness|difficult)\b/.test(contextText)) {
      return 'What did you learn from that challenge?';
    }
    return 'What kind of role are you looking for, and why?';
  }

  if (/\b(deadline|due date)\b/.test(contextText)) {
    return 'What would help you meet that deadline?';
  }
  if (/\b(client|customer)\b/.test(contextText)) {
    return 'What is the client’s main concern at the moment?';
  }
  if (/\b(meeting|available|calendar)\b/.test(contextText)) {
    return 'What time works best for a short meeting?';
  }
  return 'What is the most important task for the team this week?';
}

function isScenario(value: string): value is ConversationScenario {
  return roleplayScenarios.some((scenario) => scenario.id === value);
}

export async function sendRoleplayTurn(
  scenario: ConversationScenario,
  text: string,
  history: readonly RoleplayMessage[] = [],
): Promise<RoleplayTurn> {
  if (!isScenario(scenario)) {
    throw new Error('Tình huống hội thoại không hợp lệ.');
  }

  const message = text.trim();
  if (!message) {
    throw new Error('Hãy nhập nội dung trước khi gửi.');
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Tin nhắn không được vượt quá ${MAX_MESSAGE_LENGTH} ký tự.`);
  }

  return {
    scenario,
    reply: getReply(scenario, getContextText(message, history)),
    corrections: getCorrections(message),
    provider: 'mock',
  };
}
