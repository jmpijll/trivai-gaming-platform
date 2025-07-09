import { DifficultyLevel } from './game';

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: DifficultyLevel;
  topic: string;
  timeLimit: number;
  tags: string[];
  source?: string;
  createdAt: Date;
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface QuestionRequest {
  topic: string;
  difficulty: DifficultyLevel;
  count: number;
  excludeIds?: string[];
  customPrompt?: string;
}

export interface QuestionResponse {
  questions: Question[];
  generationTime: number;
  model: string;
  tokensUsed: number;
  cached: boolean;
}

export interface QuestionDisplayData {
  id: string;
  text: string;
  answers: string[]; // Only answer text, not the correct flag
  timeLimit: number;
  roundNumber: number;
  questionNumber: number;
}

export interface AnswerSubmission {
  questionId: string;
  playerId: string;
  answerIndex: number;
  responseTime: number;
  timestamp: Date;
}

export interface AnswerResult {
  questionId: string;
  playerId: string;
  isCorrect: boolean;
  correctAnswerIndex: number;
  pointsAwarded: number;
  responseTime: number;
  explanation: string;
}

export interface QuestionStats {
  id: string;
  timesAsked: number;
  correctAnswers: number;
  averageResponseTime: number;
  difficultyRating: number;
  lastUsed: Date;
}

export interface TopicInfo {
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  isPopular: boolean;
  questionCount: number;
  examples: string[];
}

export const QUESTION_CONSTRAINTS = {
  TOPIC_MIN_LENGTH: 2,
  TOPIC_MAX_LENGTH: 100,
  TEXT_MIN_LENGTH: 10,
  TEXT_MAX_LENGTH: 500,
  ANSWER_MIN_LENGTH: 1,
  ANSWER_MAX_LENGTH: 100,
  EXPLANATION_MAX_LENGTH: 1000,
  MIN_ANSWERS: 2,
  MAX_ANSWERS: 4,
} as const;

export const POPULAR_TOPICS = [
  'General Knowledge',
  'Science',
  'History',
  'Geography',
  'Sports',
  'Entertainment',
  'Literature',
  'Art',
  'Music',
  'Movies',
  'Technology',
  'Food & Cooking',
  'Animals',
  'Nature',
  'Current Events',
] as const;

export type PopularTopic = typeof POPULAR_TOPICS[number]; 