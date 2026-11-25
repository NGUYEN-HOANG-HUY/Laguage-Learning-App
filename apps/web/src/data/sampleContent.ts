import type {
  ConversationScenario,
  DialogueTree,
  LearningLesson,
  SampleVocabularyItem,
  VocabularyCard,
} from '../types/learning.ts';
import { createInitialSm2State } from '../utils/srs.ts';
import { dialogueTrees } from './dialogueTrees.ts';

export const sampleVocabulary: readonly SampleVocabularyItem[] = [
  {
    id: 'restaurant-menu',
    language: 'en',
    level: 'A2',
    term: 'menu',
    ipa: '/ˈmenjuː/',
    partOfSpeech: 'noun',
    meaningVi: 'thực đơn',
    collocations: ['see the menu', 'a lunch menu'],
    grammarNote: 'Dùng “Could I see…?” để nhờ xem thực đơn một cách lịch sự.',
    example: {
      text: 'Could we see the menu, please?',
      translationVi: 'Cho chúng tôi xem thực đơn được không?',
    },
  },
  {
    id: 'restaurant-recommend',
    language: 'en',
    level: 'A2',
    term: 'recommend',
    ipa: '/ˌrekəˈmend/',
    partOfSpeech: 'verb',
    meaningVi: 'gợi ý, đề xuất',
    collocations: ['recommend a dish', 'highly recommend'],
    grammarNote: 'Có thể dùng “recommend + noun” hoặc “recommend + verb-ing”.',
    example: {
      text: 'What would you recommend for a quick lunch?',
      translationVi: 'Bạn gợi ý món nào cho bữa trưa nhanh gọn?',
    },
  },
  {
    id: 'restaurant-bill',
    language: 'en',
    level: 'A2',
    term: 'bill',
    ipa: '/bɪl/',
    partOfSpeech: 'noun',
    meaningVi: 'hóa đơn',
    collocations: ['the bill', 'pay the bill'],
    grammarNote: '“Could we have the bill, please?” là cách xin hóa đơn lịch sự.',
    example: {
      text: 'Could we have the bill, please?',
      translationVi: 'Cho chúng tôi xin hóa đơn được không?',
    },
  },
  {
    id: 'interview-experience',
    language: 'en',
    level: 'B1',
    term: 'experience',
    ipa: '/ɪkˈspɪriəns/',
    partOfSpeech: 'noun',
    meaningVi: 'kinh nghiệm',
    collocations: ['work experience', 'years of experience'],
    grammarNote: 'Dùng “experience in + lĩnh vực” để mô tả kinh nghiệm trong một ngành.',
    example: {
      text: 'I have two years of experience in customer service.',
      translationVi: 'Tôi có hai năm kinh nghiệm trong lĩnh vực dịch vụ khách hàng.',
    },
  },
  {
    id: 'interview-strength',
    language: 'en',
    level: 'B1',
    term: 'strength',
    ipa: '/streŋθ/',
    partOfSpeech: 'noun',
    meaningVi: 'điểm mạnh',
    collocations: ['personal strength', 'one of my strengths'],
    grammarNote: '“One of my strengths is…” thường theo sau bởi danh từ hoặc động từ dạng -ing.',
    example: {
      text: 'One of my strengths is staying calm under pressure.',
      translationVi: 'Một trong những điểm mạnh của tôi là giữ bình tĩnh khi chịu áp lực.',
    },
  },
  {
    id: 'interview-contribute',
    language: 'en',
    level: 'B1',
    term: 'contribute',
    ipa: '/kənˈtrɪbjuːt/',
    partOfSpeech: 'verb',
    meaningVi: 'đóng góp',
    collocations: ['contribute to a team', 'contribute ideas'],
    grammarNote: 'Động từ “contribute” thường đi với giới từ “to”.',
    example: {
      text: 'I hope to contribute to the team by sharing ideas.',
      translationVi: 'Tôi hy vọng có thể đóng góp cho nhóm bằng cách chia sẻ ý tưởng.',
    },
  },
  {
    id: 'office-deadline',
    language: 'en',
    level: 'B1',
    term: 'deadline',
    ipa: '/ˈdedlaɪn/',
    partOfSpeech: 'noun',
    meaningVi: 'hạn chót',
    collocations: ['meet a deadline', 'project deadline'],
    grammarNote: '“Meet a deadline” nghĩa là hoàn thành đúng hạn; “miss a deadline” là trễ hạn.',
    example: {
      text: 'When is the deadline for the first draft?',
      translationVi: 'Hạn chót cho bản nháp đầu tiên là khi nào?',
    },
  },
  {
    id: 'office-follow-up',
    language: 'en',
    level: 'B1',
    term: 'follow up',
    ipa: '/ˈfɑːloʊ ʌp/',
    partOfSpeech: 'phrasal verb',
    meaningVi: 'theo dõi, liên hệ lại',
    collocations: ['follow up with a client', 'follow up on a request'],
    grammarNote: 'Dùng “follow up with someone” khi nói sẽ liên hệ lại với một người.',
    example: {
      text: "I'll follow up with the client this afternoon.",
      translationVi: 'Chiều nay tôi sẽ liên hệ lại với khách hàng.',
    },
  },
  {
    id: 'office-available',
    language: 'en',
    level: 'A2',
    term: 'available',
    ipa: '/əˈveɪləbəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'rảnh, có thể tham gia',
    collocations: ['available for a meeting', 'available on Friday'],
    grammarNote: '“Available for + noun” dùng để hỏi hoặc nói về khả năng tham gia.',
    example: {
      text: 'Are you available for a short meeting after lunch?',
      translationVi: 'Bạn có rảnh tham gia một cuộc họp ngắn sau bữa trưa không?',
    },
  },
];

const cardsById = new Map(
  sampleVocabulary.map(
    (item) =>
      [
        item.id,
        {
          id: item.id,
          language: item.language,
          level: item.level,
          term: item.term,
          ipa: item.ipa,
          meaningVi: item.meaningVi,
          example: { ...item.example },
          srs: createInitialSm2State(),
          contentStatus: 'sample',
        } satisfies VocabularyCard,
      ] as const,
  ),
);

function getCards(ids: readonly string[]): readonly VocabularyCard[] {
  return ids.map((id) => {
    const card = cardsById.get(id);
    if (!card) throw new Error(`Missing sample vocabulary item: ${id}`);
    return card;
  });
}

export const sampleLessons: readonly LearningLesson[] = [
  {
    id: 'restaurant-a2',
    language: 'en',
    level: 'A2',
    title: 'Gọi món tại nhà hàng',
    description: 'Hỏi về món ăn, nhờ gợi ý và yêu cầu hóa đơn một cách lịch sự.',
    scenario: 'restaurant',
    cards: getCards(['restaurant-menu', 'restaurant-recommend', 'restaurant-bill']),
    contentStatus: 'sample',
  },
  {
    id: 'job-interview-b1',
    language: 'en',
    level: 'B1',
    title: 'Giới thiệu bản thân khi phỏng vấn',
    description: 'Nói về kinh nghiệm, điểm mạnh và điều bạn có thể đóng góp.',
    scenario: 'interview',
    cards: getCards([
      'interview-experience',
      'interview-strength',
      'interview-contribute',
    ]),
    contentStatus: 'sample',
  },
  {
    id: 'office-communication-b1',
    language: 'en',
    level: 'B1',
    title: 'Trao đổi công việc ở văn phòng',
    description: 'Hỏi về hạn chót, cập nhật khách hàng và sắp xếp cuộc họp.',
    scenario: 'office',
    cards: getCards(['office-deadline', 'office-follow-up', 'office-available']),
    contentStatus: 'sample',
  },
];

export const sampleDialogueTrees: readonly DialogueTree[] = dialogueTrees.filter(
  (tree) => tree.id === 'restaurant' || tree.id === 'interview',
);

export { dialogueTrees };
