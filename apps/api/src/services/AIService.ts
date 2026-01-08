import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';
import { INJECTION_SHIELD, SYSTEM_CONTEXT } from '@slide-agent/shared';

export class AIService {
  private client: OpenAI | null = null;
  private enabled: boolean;

  constructor() {
    this.enabled = config.openai.enabled && !!config.openai.apiKey;

    if (this.enabled) {
      this.client = new OpenAI({
        apiKey: config.openai.apiKey,
      });
      logger.info('OpenAI client initialized');
    } else {
      logger.warn('AI features disabled - no API key provided');
    }
  }

  async generateStructured<T>(prompt: string, schema: any, untrustedData?: string): Promise<T | null> {
    if (!this.enabled || !this.client) {
      logger.warn('AI generation skipped - service not enabled');
      return null;
    }

    try {
      // Add injection shield if dealing with untrusted data
      const finalPrompt = untrustedData
        ? `${INJECTION_SHIELD}\n${prompt}\n<<<USER_DATA>>>\n${untrustedData}\n<<<END_USER_DATA>>>`
        : prompt;

      const response = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: SYSTEM_CONTEXT },
          { role: 'user', content: finalPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      const parsed = JSON.parse(content);

      // Validate with schema if provided
      if (schema) {
        return schema.parse(parsed);
      }

      return parsed as T;
    } catch (error) {
      logger.error({ error, prompt }, 'AI generation failed');

      // Retry once with repair prompt if JSON parse error
      if (error instanceof SyntaxError) {
        logger.info('Retrying with repair prompt');
        return this.retryWithRepair<T>(prompt, schema);
      }

      throw error;
    }
  }

  private async retryWithRepair<T>(originalPrompt: string, schema: any): Promise<T | null> {
    if (!this.client) return null;

    try {
      const repairPrompt = `${originalPrompt}\n\nIMPORTANT: Return ONLY valid JSON. Do not include any markdown, code blocks, or explanations.`;

      const response = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: 'You are a precise JSON generator. Return only valid JSON.' },
          { role: 'user', content: repairPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;

      const parsed = JSON.parse(content);
      return schema ? schema.parse(parsed) : (parsed as T);
    } catch (error) {
      logger.error({ error }, 'Retry with repair failed');
      return null;
    }
  }

  async generateText(prompt: string, maxTokens: number = 500): Promise<string | null> {
    if (!this.enabled || !this.client) {
      return null;
    }

    try {
      const response = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: SYSTEM_CONTEXT },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || null;
    } catch (error) {
      logger.error({ error, prompt }, 'Text generation failed');
      throw error;
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Mock mode for development without API key
  getMockResponse<T>(type: string): T | null {
    logger.info({ type }, 'Returning mock AI response');

    const mocks: Record<string, any> = {
      deck_plan: {
        outline: [
          {
            title: 'Introduction',
            type: 'title',
            keyPoints: [],
            notes: 'Opening slide',
          },
          {
            title: 'Key Insights',
            type: 'content',
            keyPoints: ['First insight', 'Second insight', 'Third insight'],
            notes: 'Main content',
          },
        ],
        narrative: 'A compelling story about the topic',
        agenda: ['Introduction', 'Key Points', 'Conclusion'],
        talkTrack: 'This is a sample presentation covering key insights.',
      },
    };

    return mocks[type] || null;
  }
}

export const aiService = new AIService();
