import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || this.configService.get<string>('GROQ_API_KEY');
    const baseURL = this.configService.get<string>('AI_BASE_URL');

    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY or GROQ_API_KEY not set. AI features will not work.');
    }

    this.client = new OpenAI({
      apiKey: apiKey || 'sk-placeholder',
      baseURL: baseURL || undefined, // Use custom base URL if provided (e.g., Groq)
    });

    this.model = this.configService.get<string>('OPENAI_MODEL') || 'llama-3.1-70b-versatile';
  }

  /**
   * Stream chat completion responses
   */
  async *streamChatCompletion(messages: ChatMessage[]): AsyncIterable<string> {
    try {
      const formattedMessages: ChatCompletionMessageParam[] = messages.map(
        (msg) => ({
          role: msg.role,
          content: msg.content,
        }),
      );

      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: formattedMessages,
        stream: true,
        temperature: 0.7,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      this.logger.error('Error streaming chat completion', error);
      throw error;
    }
  }

  /**
   * Get a complete chat completion (non-streaming)
   */
  async getChatCompletion(messages: ChatMessage[]): Promise<string> {
    try {
      const formattedMessages: ChatCompletionMessageParam[] = messages.map(
        (msg) => ({
          role: msg.role,
          content: msg.content,
        }),
      );

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: formattedMessages,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('Error getting chat completion', error);
      throw error;
    }
  }

  /**
   * Analyze a website URL and extract key information
   */
  async analyzeWebsite(url: string, scrapedContent: any): Promise<any> {
    try {
      const prompt = `Analyze this website content from ${url}:

${JSON.stringify(scrapedContent, null, 2)}

Extract and return a JSON object with:
- restaurantName: The name of the restaurant
- description: A brief description
- primaryColors: Array of primary brand colors (hex codes)
- pageTypes: Array of detected page types (menu, about, contact, gallery, hours, etc.)
- menuItems: Array of menu items if found
- contactInfo: Phone, email, address if found

Return ONLY valid JSON.`;

      const completion = await this.getChatCompletion([
        {
          role: 'system',
          content: 'You are an expert at analyzing restaurant websites. Always return valid JSON.',
        },
        { role: 'user', content: prompt },
      ]);

      return JSON.parse(completion);
    } catch (error) {
      this.logger.error('Error analyzing website', error);
      throw error;
    }
  }

  /**
   * Generate Bricks Builder elements from content
   */
  async generateBricksElements(
    pageType: string,
    content: any,
  ): Promise<any[]> {
    try {
      const prompt = `Generate Bricks Builder elements for a ${pageType} page based on this content:

${JSON.stringify(content, null, 2)}

Create a JSON array of Bricks elements with the structure:
{
  "id": "unique-id",
  "name": "element-type",
  "settings": {
    "text": "content",
    "tag": "h1|h2|p|etc",
    ...other relevant settings
  },
  "children": []
}

Return ONLY a valid JSON array of Bricks elements.`;

      const completion = await this.getChatCompletion([
        {
          role: 'system',
          content: 'You are an expert at creating WordPress Bricks Builder elements. Always return valid JSON arrays.',
        },
        { role: 'user', content: prompt },
      ]);

      return JSON.parse(completion);
    } catch (error) {
      this.logger.error('Error generating Bricks elements', error);
      throw error;
    }
  }

  /**
   * Refine content based on user instructions
   */
  async refineContent(
    originalContent: string,
    instructions: string,
  ): Promise<string> {
    try {
      const prompt = `Original content:
${originalContent}

User instructions:
${instructions}

Please refine the content according to the instructions. Return ONLY the refined content.`;

      return await this.getChatCompletion([
        {
          role: 'system',
          content: 'You are a helpful assistant that refines content based on user instructions.',
        },
        { role: 'user', content: prompt },
      ]);
    } catch (error) {
      this.logger.error('Error refining content', error);
      throw error;
    }
  }

  /**
   * Generate a conversation title based on the first message
   */
  async generateConversationTitle(firstMessage: string): Promise<string> {
    try {
      const prompt = `Generate a short, concise title (3-5 words) for a conversation that starts with:
"${firstMessage}"

Return ONLY the title, no quotes or extra text.`;

      const completion = await this.getChatCompletion([
        {
          role: 'system',
          content: 'You generate concise conversation titles.',
        },
        { role: 'user', content: prompt },
      ]);

      return completion.trim();
    } catch (error) {
      this.logger.error('Error generating conversation title', error);
      return 'New Conversation';
    }
  }
}
