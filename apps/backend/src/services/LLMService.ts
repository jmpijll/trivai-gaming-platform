import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Local type definitions (will be moved to shared package later)
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXTREME = 'extreme',
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: DifficultyLevel;
  topic: string;
  timeLimit: number;
}

interface QuestionGenerationOptions {
  topic: string;
  difficulty: DifficultyLevel;
  count: number;
  previousQuestions?: string[];
}

interface LLMConfig {
  apiKey?: string;
  baseURL?: string;
  model: string;
}

export class LLMService {
  private client: OpenAI;
  private model: string;

  constructor(config: LLMConfig) {
    // Initialize OpenAI client with Ollama compatibility
    this.client = new OpenAI({
      apiKey: config.apiKey || 'sk-no-key-required', // Ollama doesn't require API key
      baseURL: config.baseURL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
    });
    this.model = config.model || process.env.LLM_MODEL || 'llama2';
  }

  /**
   * Generate trivia questions using LLM
   */
  async generateQuestions(options: QuestionGenerationOptions): Promise<Question[]> {
    const { topic, difficulty, count, previousQuestions = [] } = options;

    try {
      const prompt = this.buildQuestionPrompt(topic, difficulty, count, previousQuestions);
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Add some creativity
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from LLM');
      }

      return this.parseQuestions(response, difficulty, topic);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to hardcoded questions in case of LLM failure
      return this.getFallbackQuestions(topic, difficulty, count);
    }
  }

  /**
   * System prompt for the LLM
   */
  private getSystemPrompt(): string {
    return `You are an expert trivia question generator for a multiplayer gaming platform. 
You create engaging, fair, and educational questions for players of all backgrounds.

CRITICAL REQUIREMENTS:
- Generate EXACTLY the requested number of questions
- Each question must have exactly 4 answer options
- Only ONE answer can be correct
- Questions must be appropriate for all ages
- Include brief, educational explanations
- Return valid JSON only
- Avoid offensive, controversial, or inappropriate content
- Make questions challenging but fair
- Ensure diversity in question types within the topic

JSON FORMAT:
{
  "questions": [
    {
      "text": "Question text here?",
      "answers": [
        {"text": "Option A", "isCorrect": false},
        {"text": "Option B", "isCorrect": true},
        {"text": "Option C", "isCorrect": false},
        {"text": "Option D", "isCorrect": false}
      ],
      "explanation": "Brief explanation of why this answer is correct and educational context."
    }
  ]
}`;
  }

  /**
   * Build the question generation prompt
   */
  private buildQuestionPrompt(
    topic: string, 
    difficulty: DifficultyLevel, 
    count: number, 
    previousQuestions: string[]
  ): string {
    const difficultyDescriptions = {
      [DifficultyLevel.EASY]: 'Easy - Basic knowledge, common facts, introductory level',
      [DifficultyLevel.MEDIUM]: 'Medium - Intermediate knowledge, some specialized information',
      [DifficultyLevel.HARD]: 'Hard - Advanced knowledge, detailed facts, expert level',
      [DifficultyLevel.EXTREME]: 'Extreme - Very specialized, obscure facts, expert+ level'
    };

    let prompt = `Generate ${count} trivia questions about "${topic}".

DIFFICULTY: ${difficultyDescriptions[difficulty]}

REQUIREMENTS:
- Each question must be unique and not repeat information
- Mix different types of questions (facts, dates, people, concepts, etc.)
- Ensure answers are definitively correct/incorrect
- Make incorrect options plausible but clearly wrong
- Keep questions concise but clear
- Explanations should be educational and informative`;

    if (previousQuestions.length > 0) {
      prompt += `\n\nAVOID REPEATING these topics/questions:\n${previousQuestions.join('\n')}`;
    }

    prompt += '\n\nReturn your response as valid JSON only, following the exact format specified in the system prompt.';

    return prompt;
  }

  /**
   * Parse LLM response into Question objects
   */
  private parseQuestions(response: string, difficulty: DifficultyLevel, topic: string): Question[] {
    try {
      const parsed = JSON.parse(response);
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid response format: missing questions array');
      }

      return parsed.questions.map((q: any) => {
        if (!q.text || !q.answers || !Array.isArray(q.answers) || q.answers.length !== 4) {
          throw new Error('Invalid question format');
        }

        const correctAnswerIndex = q.answers.findIndex((a: any) => a.isCorrect);
        if (correctAnswerIndex === -1) {
          throw new Error('No correct answer found');
        }

        const question: Question = {
          id: uuidv4(),
          text: q.text,
          answers: q.answers.map((a: any) => ({
            text: a.text,
            isCorrect: a.isCorrect
          })),
          correctAnswerIndex,
          explanation: q.explanation || 'Explanation not provided.',
          difficulty,
          topic,
          timeLimit: this.getTimeLimitForDifficulty(difficulty)
        };

        return question;
      });
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      throw new Error(`Failed to parse questions: ${error}`);
    }
  }

  /**
   * Get time limit based on difficulty
   */
  private getTimeLimitForDifficulty(difficulty: DifficultyLevel): number {
    const timeLimits = {
      [DifficultyLevel.EASY]: 20000,    // 20 seconds
      [DifficultyLevel.MEDIUM]: 30000,  // 30 seconds  
      [DifficultyLevel.HARD]: 45000,    // 45 seconds
      [DifficultyLevel.EXTREME]: 60000  // 60 seconds
    };
    return timeLimits[difficulty];
  }

  /**
   * Fallback questions when LLM fails
   */
  private getFallbackQuestions(topic: string, difficulty: DifficultyLevel, count: number): Question[] {
    const fallbackQuestion: Question = {
      id: uuidv4(),
      text: `What is a key fact about ${topic}?`,
      answers: [
        { text: "This is a fallback question", isCorrect: true },
        { text: "LLM service is temporarily unavailable", isCorrect: false },
        { text: "Please try again later", isCorrect: false },
        { text: "System is experiencing issues", isCorrect: false }
      ],
      correctAnswerIndex: 0,
      explanation: "This is a fallback question generated when the LLM service is unavailable.",
      difficulty,
      topic,
      timeLimit: this.getTimeLimitForDifficulty(difficulty)
    };

    return Array(count).fill(null).map(() => ({
      ...fallbackQuestion,
      id: uuidv4()
    }));
  }

  /**
   * Test LLM connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'Hello, are you working?' }],
        max_tokens: 10
      });

      return !!completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('LLM connection test failed:', error);
      return false;
    }
  }

  /**
   * Generate topics for topic selection
   */
  async generateTopics(count: number = 10): Promise<string[]> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a trivia topic generator. Generate diverse, engaging topics suitable for trivia questions. Return only a JSON array of topic strings.'
          },
          {
            role: 'user',
            content: `Generate ${count} diverse trivia topics. Include a mix of: science, history, geography, entertainment, sports, literature, technology, nature, and culture. Return as JSON array: ["Topic 1", "Topic 2", ...]`
          }
        ],
        temperature: 0.9,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        return this.getFallbackTopics(count);
      }

      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : parsed.topics || this.getFallbackTopics(count);
    } catch (error) {
      console.error('Error generating topics:', error);
      return this.getFallbackTopics(count);
    }
  }

  /**
   * Fallback topics when LLM fails
   */
  private getFallbackTopics(count: number): string[] {
    const topics = [
      'World History', 'Science & Nature', 'Geography', 'Literature', 
      'Movies & TV', 'Sports', 'Technology', 'Music', 'Art & Culture',
      'Food & Cooking', 'Space & Astronomy', 'Animals', 'Politics',
      'Philosophy', 'Mathematics', 'Medicine', 'Architecture', 'Religion'
    ];
    
    return topics.slice(0, count);
  }
}

// Export singleton instance
export const llmService = new LLMService({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.LLM_BASE_URL || process.env.OLLAMA_BASE_URL,
  model: process.env.LLM_MODEL || 'llama2'
}); 