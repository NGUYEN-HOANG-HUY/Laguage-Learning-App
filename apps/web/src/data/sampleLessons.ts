import type {
  ConversationScenario,
  LearningLesson,
  ProficiencyLevel,
  VocabularyCard,
} from '../types/learning';
import { createInitialSm2State } from '../utils/srs.ts';

function createCard(
  id: string,
  level: ProficiencyLevel,
  term: string,
  ipa: string,
  meaningVi: string,
  exampleText: string,
  exampleTranslationVi: string,
): VocabularyCard {
  return {
    id,
    language: 'en',
    level,
    term,
    ipa,
    meaningVi,
    example: {
      text: exampleText,
      translationVi: exampleTranslationVi,
    },
    srs: createInitialSm2State(),
    contentStatus: 'sample',
  };
}

function createLesson(
  id: string,
  level: ProficiencyLevel,
  title: string,
  description: string,
  scenario: ConversationScenario,
  cards: readonly VocabularyCard[],
): LearningLesson {
  return {
    id,
    language: 'en',
    level,
    title,
    description,
    scenario,
    cards,
    contentStatus: 'sample',
  };
}

export const sampleLessons: readonly LearningLesson[] = [
  createLesson(
    'restaurant-a2',
    'A2',
    'Gọi món tại nhà hàng',
    'Hỏi về món ăn, nhờ gợi ý và yêu cầu hóa đơn một cách lịch sự.',
    'restaurant',
    [
      createCard(
        'restaurant-menu',
        'A2',
        'menu',
        '/ˈmenjuː/',
        'thực đơn',
        'Could we see the menu, please?',
        'Cho chúng tôi xem thực đơn được không?',
      ),
      createCard(
        'restaurant-recommend',
        'A2',
        'recommend',
        '/ˌrekəˈmend/',
        'gợi ý, đề xuất',
        'What would you recommend for a quick lunch?',
        'Bạn gợi ý món nào cho bữa trưa nhanh gọn?',
      ),
      createCard(
        'restaurant-bill',
        'A2',
        'bill',
        '/bɪl/',
        'hóa đơn',
        'Could we have the bill, please?',
        'Cho chúng tôi xin hóa đơn được không?',
      ),
    ],
  ),
  createLesson(
    'job-interview-b1',
    'B1',
    'Giới thiệu bản thân khi phỏng vấn',
    'Nói về kinh nghiệm, điểm mạnh và điều bạn có thể đóng góp.',
    'interview',
    [
      createCard(
        'interview-experience',
        'B1',
        'experience',
        '/ɪkˈspɪriəns/',
        'kinh nghiệm',
        'I have two years of experience in customer service.',
        'Tôi có hai năm kinh nghiệm trong lĩnh vực dịch vụ khách hàng.',
      ),
      createCard(
        'interview-strength',
        'B1',
        'strength',
        '/streŋθ/',
        'điểm mạnh',
        'One of my strengths is staying calm under pressure.',
        'Một trong những điểm mạnh của tôi là giữ bình tĩnh khi chịu áp lực.',
      ),
      createCard(
        'interview-contribute',
        'B1',
        'contribute',
        '/kənˈtrɪbjuːt/',
        'đóng góp',
        'I hope to contribute to the team by sharing ideas.',
        'Tôi hy vọng có thể đóng góp cho nhóm bằng cách chia sẻ ý tưởng.',
      ),
    ],
  ),
  createLesson(
    'office-communication-b1',
    'B1',
    'Trao đổi công việc ở văn phòng',
    'Hỏi về hạn chót, cập nhật khách hàng và sắp xếp cuộc họp.',
    'office',
    [
      createCard(
        'office-deadline',
        'B1',
        'deadline',
        '/ˈdedlaɪn/',
        'hạn chót',
        'When is the deadline for the first draft?',
        'Hạn chót cho bản nháp đầu tiên là khi nào?',
      ),
      createCard(
        'office-follow-up',
        'B1',
        'follow up',
        '/ˈfɑːloʊ ʌp/',
        'theo dõi, liên hệ lại',
        "I'll follow up with the client this afternoon.",
        'Chiều nay tôi sẽ liên hệ lại với khách hàng.',
      ),
      createCard(
        'office-available',
        'A2',
        'available',
        '/əˈveɪləbəl/',
        'rảnh, có thể tham gia',
        'Are you available for a short meeting after lunch?',
        'Bạn có rảnh tham gia một cuộc họp ngắn sau bữa trưa không?',
      ),
    ],
  ),
];
