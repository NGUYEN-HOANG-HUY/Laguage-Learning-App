export const SUPPORTED_LANGUAGES = ['en', 'ja', 'ko'] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];
export type ProficiencyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
export type ContentStatus = 'sample' | 'reviewed';
export type ConversationScenario = 'restaurant' | 'interview' | 'office';

export type Sm2State = {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string;
  lastReviewedAt: string | null;
  lapses: number;
};

export type ExampleSentence = {
  text: string;
  translationVi: string;
};

export type VocabularyCard = {
  id: string;
  language: LanguageCode;
  level: ProficiencyLevel;
  term: string;
  ipa: string;
  meaningVi: string;
  example: ExampleSentence;
  srs: Sm2State;
  contentStatus: ContentStatus;
};

export type LearningLesson = {
  id: string;
  language: LanguageCode;
  level: ProficiencyLevel;
  title: string;
  description: string;
  scenario: ConversationScenario;
  cards: readonly VocabularyCard[];
  contentStatus: ContentStatus;
};

export type ReviewEvent = {
  id: string;
  cardId: string;
  rating: ReviewRating;
  reviewedAt: string;
  previousState: Sm2State;
  nextState: Sm2State;
};

export type RoleplayMessage = {
  role: 'user' | 'assistant';
  text: string;
};

export type RoleplayCorrection = {
  original: string;
  corrected: string;
  explanationVi: string;
};

export type RoleplayTurn = {
  scenario: ConversationScenario;
  reply: string;
  corrections: RoleplayCorrection[];
  provider: 'mock';
};

export type DialogueImpact = 'positive' | 'neutral' | 'needs_repair';

export type DialogueChoice = {
  id: string;
  utterance: string;
  response: string;
  nextNodeId: string | null;
  impact: DialogueImpact;
  explanationVi: string;
  targetExpressions: string[];
};

export type DialogueNode = {
  id: string;
  partnerPrompt: string;
  instructionVi: string;
  choices: readonly DialogueChoice[];
};

export type DialogueTree = {
  id: ConversationScenario;
  language: LanguageCode;
  level: ProficiencyLevel;
  title: string;
  description: string;
  startNodeId: string;
  nodes: readonly DialogueNode[];
};

export type SampleVocabularyItem = {
  id: string;
  language: LanguageCode;
  level: ProficiencyLevel;
  term: string;
  ipa: string;
  partOfSpeech: string;
  meaningVi: string;
  collocations: readonly string[];
  grammarNote: string;
  example: ExampleSentence;
};
