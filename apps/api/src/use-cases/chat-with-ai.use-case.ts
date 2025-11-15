import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../modules/openai';
import { AnalyzeSiteUseCase } from './analyze-site.use-case';
import { GenerateRebuildUseCase } from './generate-rebuild.use-case';

export interface ChatContext {
  conversationId: string;
  currentAnalysisId?: string;
  currentRebuildId?: string;
}

export interface ChatResponse {
  content: string;
  toolCalls?: Array<{
    tool: 'analyze_website' | 'generate_rebuild' | 'deploy_to_wordpress';
    params: any;
    result?: any;
  }>;
  metadata?: any;
}

@Injectable()
export class ChatWithAIUseCase {
  private readonly logger = new Logger(ChatWithAIUseCase.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly analyzeSiteUseCase: AnalyzeSiteUseCase,
    private readonly generateRebuildUseCase: GenerateRebuildUseCase,
  ) {}

  /**
   * Process a chat message and detect if tools should be called
   */
  async execute(
    message: string,
    context: ChatContext,
  ): Promise<ChatResponse> {
    this.logger.log('Processing chat message with tool detection');

    // Detect if the user wants to analyze a website
    const websiteUrl = this.extractWebsiteUrl(message);

    if (websiteUrl) {
      return await this.handleWebsiteAnalysis(websiteUrl, context);
    }

    // Detect if the user wants to generate a rebuild
    if (this.isGenerateRebuildIntent(message) && context.currentAnalysisId) {
      return await this.handleGenerateRebuild(context);
    }

    // Detect if the user wants to deploy
    if (this.isDeployIntent(message) && context.currentRebuildId) {
      return await this.handleDeploy(context);
    }

    // Regular chat response
    return {
      content: await this.openaiService.getChatCompletion([
        {
          role: 'system',
          content:
            'You are a helpful AI assistant that helps users rebuild their restaurant websites. You can analyze websites, generate previews, and deploy to WordPress.',
        },
        { role: 'user', content: message },
      ]),
    };
  }

  /**
   * Handle website analysis request
   */
  private async handleWebsiteAnalysis(
    url: string,
    context: ChatContext,
  ): Promise<ChatResponse> {
    try {
      this.logger.log(`Analyzing website: ${url}`);

      const result = await this.analyzeSiteUseCase.execute(url);

      if (result.status === 'failed') {
        return {
          content: `I encountered an error while analyzing ${url}: ${result.error}. Please check the URL and try again.`,
          toolCalls: [
            {
              tool: 'analyze_website',
              params: { url },
              result: { error: result.error },
            },
          ],
        };
      }

      const pagesText =
        result.pages && result.pages.length > 0
          ? result.pages.map((p) => `- ${p.pageType} (${p.url})`).join('\n')
          : 'No pages detected';

      const content = `I've analyzed ${url} and found the following:

**Restaurant Name:** ${result.restaurantInfo?.name || 'Unknown'}

**Description:** ${result.restaurantInfo?.description || 'No description available'}

**Pages Detected:**
${pagesText}

**Primary Colors:** ${result.restaurantInfo?.primaryColors?.join(', ') || 'Not detected'}

Would you like me to generate a preview of the rebuilt website?`;

      return {
        content,
        toolCalls: [
          {
            tool: 'analyze_website',
            params: { url },
            result,
          },
        ],
        metadata: {
          analysisId: result.analysisId,
        },
      };
    } catch (error) {
      this.logger.error('Error in website analysis', error);

      return {
        content: `I encountered an error analyzing the website: ${error.message}. Please try again.`,
      };
    }
  }

  /**
   * Handle rebuild generation request
   */
  private async handleGenerateRebuild(
    context: ChatContext,
  ): Promise<ChatResponse> {
    try {
      this.logger.log(
        `Generating rebuild for analysis ${context.currentAnalysisId}`,
      );

      const result = await this.generateRebuildUseCase.execute(
        context.currentAnalysisId!,
      );

      if (result.status === 'failed') {
        return {
          content: `I encountered an error generating the rebuild: ${result.error}. Please try again.`,
        };
      }

      const pagesText =
        result.pages && result.pages.length > 0
          ? result.pages
              .map(
                (p) => `- ${p.title} (${p.elementsCount} elements)`,
              )
              .join('\n')
          : 'No pages generated';

      const content = `Great! I've generated a preview of your rebuilt website.

**Pages Created:**
${pagesText}

**Preview URL:** ${result.previewUrl}

You can view the preview and make adjustments. When you're ready, I can deploy it to your WordPress site.`;

      return {
        content,
        toolCalls: [
          {
            tool: 'generate_rebuild',
            params: { analysisId: context.currentAnalysisId },
            result,
          },
        ],
        metadata: {
          rebuildId: result.rebuildId,
        },
      };
    } catch (error) {
      this.logger.error('Error generating rebuild', error);

      return {
        content: `I encountered an error generating the rebuild: ${error.message}. Please try again.`,
      };
    }
  }

  /**
   * Handle deployment request
   */
  private async handleDeploy(context: ChatContext): Promise<ChatResponse> {
    // Deployment logic would go here
    // For now, return a placeholder

    return {
      content: `To deploy your website to WordPress, I'll need some information:

1. **WordPress Site URL** - Where should I deploy? (e.g., https://yoursite.com)
2. **WordPress Admin Username**
3. **WordPress Application Password** (you can create this in your WordPress admin)

Please provide these details and I'll start the deployment process.`,
      toolCalls: [
        {
          tool: 'deploy_to_wordpress',
          params: { rebuildId: context.currentRebuildId },
        },
      ],
    };
  }

  /**
   * Extract website URL from message
   */
  private extractWebsiteUrl(message: string): string | null {
    // Simple URL extraction - matches http(s)://domain.com patterns
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const matches = message.match(urlRegex);

    return matches ? matches[0] : null;
  }

  /**
   * Detect if user wants to generate a rebuild
   */
  private isGenerateRebuildIntent(message: string): boolean {
    const keywords = [
      'generate',
      'create',
      'build',
      'preview',
      'show me',
      'make',
      'rebuild',
    ];

    const lowerMessage = message.toLowerCase();

    return keywords.some((keyword) => lowerMessage.includes(keyword));
  }

  /**
   * Detect if user wants to deploy
   */
  private isDeployIntent(message: string): boolean {
    const keywords = ['deploy', 'publish', 'launch', 'go live', 'upload'];

    const lowerMessage = message.toLowerCase();

    return keywords.some((keyword) => lowerMessage.includes(keyword));
  }
}
