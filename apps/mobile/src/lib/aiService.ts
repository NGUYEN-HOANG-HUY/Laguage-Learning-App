export type RoleplayScenarioId = 'restaurant' | 'interview' | 'office';

export type RoleplayScenario = {
  id: RoleplayScenarioId;
  title: string;
  description: string;
  greeting: string;
};

export type RoleplayCorrection = {
  original: string;
  corrected: string;
  explanationVi: string;
};

export type RoleplayTurn = {
  reply: string;
  corrections: RoleplayCorrection[];
  provider: 'mock';
};

export const roleplayScenarios: readonly RoleplayScenario[] = [
  {
    id: 'restaurant',
    title: 'Gọi món',
    description: 'Gọi món và trao đổi với nhân viên nhà hàng.',
    greeting: 'Hello! Welcome in. What would you like to order today?',
  },
  {
    id: 'interview',
    title: 'Phỏng vấn',
    description: 'Trả lời câu hỏi phỏng vấn bằng tiếng Anh.',
    greeting: 'Thanks for coming in. Could you tell me a little about yourself?',
  },
  {
    id: 'office',
    title: 'Giao tiếp công sở',
    description: 'Trao đổi công việc với đồng nghiệp.',
    greeting: 'Good morning! What are you focusing on first today?',
  },
];

export async function sendRoleplayTurn(
  scenarioId: RoleplayScenarioId,
  text: string,
): Promise<RoleplayTurn> {
  const scenario = roleplayScenarios.find((item) => item.id === scenarioId);
  if (!scenario) throw new Error('Tình huống hội thoại không hợp lệ.');

  const message = text.trim();
  if (!message) throw new Error('Hãy nhập nội dung trước khi gửi.');

  const corrections: RoleplayCorrection[] = [];
  const agreeMatch = message.match(/\bI am agree\b/i);
  if (agreeMatch) {
    corrections.push({
      original: agreeMatch[0],
      corrected: 'I agree',
      explanationVi: '“Agree” là động từ nên không dùng “am” ở trước.',
    });
  }

  if (
    scenarioId === 'restaurant' &&
    /\bI want order\b/i.test(message)
  ) {
    corrections.push({
      original: message.match(/\bI want order\b/i)?.[0] ?? 'I want order',
      corrected: "I'd like to order",
      explanationVi: 'Thêm “to” sau “want”; “I’d like” lịch sự hơn khi gọi món.',
    });
  }

  const replies: Record<RoleplayScenarioId, string> = {
    restaurant: 'That sounds good. Would you like anything to drink with your order?',
    interview: 'Thanks for sharing. What is one strength you would bring to this role?',
    office: 'Sure. What is the main priority you would like us to handle this afternoon?',
  };

  return {
    reply: replies[scenario.id],
    corrections,
    provider: 'mock',
  };
}
