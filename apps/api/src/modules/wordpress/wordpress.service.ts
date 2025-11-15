import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface WordPressCredentials {
  baseUrl: string;
  username: string;
  applicationPassword: string;
}

export interface WordPressPage {
  title: string;
  content: string;
  status: 'publish' | 'draft' | 'pending';
  slug?: string;
  meta?: Record<string, any>;
}

export interface WordPressMedia {
  filename: string;
  content: Buffer;
  mimeType: string;
  alt?: string;
}

export interface DeploymentResult {
  success: boolean;
  pageId?: number;
  pageUrl?: string;
  error?: string;
}

@Injectable()
export class WordPressService {
  private readonly logger = new Logger(WordPressService.name);
  private readonly defaultBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.defaultBaseUrl = this.configService.get<string>('WORDPRESS_DEFAULT_URL') || '';
  }

  /**
   * Create an authenticated axios client for WordPress REST API
   */
  private createClient(credentials: WordPressCredentials): AxiosInstance {
    const auth = Buffer.from(
      `${credentials.username}:${credentials.applicationPassword}`,
    ).toString('base64');

    return axios.create({
      baseURL: `${credentials.baseUrl}/wp-json/wp/v2`,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Test WordPress connection and credentials
   */
  async testConnection(credentials: WordPressCredentials): Promise<{
    success: boolean;
    version?: string;
    error?: string;
  }> {
    try {
      const client = this.createClient(credentials);

      // Test by fetching current user
      const response = await client.get('/users/me');

      this.logger.log(`WordPress connection successful: ${credentials.baseUrl}`);

      return {
        success: true,
        version: response.headers['x-wp-version'] || 'unknown',
      };
    } catch (error) {
      this.logger.error('WordPress connection failed', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Create a new WordPress page
   */
  async createPage(
    credentials: WordPressCredentials,
    page: WordPressPage,
  ): Promise<DeploymentResult> {
    try {
      const client = this.createClient(credentials);

      this.logger.log(`Creating WordPress page: ${page.title}`);

      const response = await client.post('/pages', {
        title: page.title,
        content: page.content,
        status: page.status,
        slug: page.slug,
        meta: page.meta || {},
      });

      const pageId = response.data.id;
      const pageUrl = response.data.link;

      this.logger.log(`Page created successfully: ${pageUrl}`);

      return {
        success: true,
        pageId,
        pageUrl,
      };
    } catch (error) {
      this.logger.error('Failed to create WordPress page', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Page creation failed',
      };
    }
  }

  /**
   * Update an existing WordPress page
   */
  async updatePage(
    credentials: WordPressCredentials,
    pageId: number,
    updates: Partial<WordPressPage>,
  ): Promise<DeploymentResult> {
    try {
      const client = this.createClient(credentials);

      this.logger.log(`Updating WordPress page: ${pageId}`);

      const response = await client.post(`/pages/${pageId}`, {
        title: updates.title,
        content: updates.content,
        status: updates.status,
        slug: updates.slug,
        meta: updates.meta || {},
      });

      const pageUrl = response.data.link;

      this.logger.log(`Page updated successfully: ${pageUrl}`);

      return {
        success: true,
        pageId,
        pageUrl,
      };
    } catch (error) {
      this.logger.error('Failed to update WordPress page', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Page update failed',
      };
    }
  }

  /**
   * Upload media to WordPress
   */
  async uploadMedia(
    credentials: WordPressCredentials,
    media: WordPressMedia,
  ): Promise<{
    success: boolean;
    mediaId?: number;
    url?: string;
    error?: string;
  }> {
    try {
      const auth = Buffer.from(
        `${credentials.username}:${credentials.applicationPassword}`,
      ).toString('base64');

      // For Node.js, we use the buffer directly
      const response = await axios.post(
        `${credentials.baseUrl}/wp-json/wp/v2/media`,
        media.content,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': media.mimeType,
            'Content-Disposition': `attachment; filename="${media.filename}"`,
          },
          timeout: 60000, // Longer timeout for media uploads
        },
      );

      this.logger.log(`Media uploaded successfully: ${response.data.source_url}`);

      return {
        success: true,
        mediaId: response.data.id,
        url: response.data.source_url,
      };
    } catch (error) {
      this.logger.error('Failed to upload media', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Media upload failed',
      };
    }
  }

  /**
   * Get all pages from WordPress
   */
  async getPages(
    credentials: WordPressCredentials,
    options?: {
      status?: string;
      perPage?: number;
      page?: number;
    },
  ): Promise<{
    success: boolean;
    pages?: Array<{ id: number; title: string; slug: string; link: string }>;
    error?: string;
  }> {
    try {
      const client = this.createClient(credentials);

      const params = {
        status: options?.status || 'any',
        per_page: options?.perPage || 100,
        page: options?.page || 1,
      };

      const response = await client.get('/pages', { params });

      const pages = response.data.map((page: any) => ({
        id: page.id,
        title: page.title.rendered,
        slug: page.slug,
        link: page.link,
      }));

      return {
        success: true,
        pages,
      };
    } catch (error) {
      this.logger.error('Failed to fetch WordPress pages', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pages',
      };
    }
  }

  /**
   * Delete a WordPress page
   */
  async deletePage(
    credentials: WordPressCredentials,
    pageId: number,
    force: boolean = false,
  ): Promise<DeploymentResult> {
    try {
      const client = this.createClient(credentials);

      this.logger.log(`Deleting WordPress page: ${pageId}`);

      await client.delete(`/pages/${pageId}`, {
        params: { force },
      });

      this.logger.log(`Page deleted successfully: ${pageId}`);

      return {
        success: true,
        pageId,
      };
    } catch (error) {
      this.logger.error('Failed to delete WordPress page', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Page deletion failed',
      };
    }
  }

  /**
   * Convert Bricks elements to WordPress/Bricks compatible format
   */
  convertBricksElements(elements: any[]): string {
    // This would convert our internal Bricks element format
    // to the format WordPress Bricks expects
    // For now, return a simple HTML representation

    const elementsJson = JSON.stringify(elements, null, 2);

    return `
<!-- Bricks Page Data -->
<div class="bricks-container" data-bricks='${elementsJson}'>
  ${this.generateBricksHTML(elements)}
</div>
    `.trim();
  }

  /**
   * Generate HTML preview from Bricks elements
   */
  private generateBricksHTML(elements: any[]): string {
    if (!Array.isArray(elements)) {
      return '';
    }

    return elements
      .map((element) => {
        const type = element.name || element.type || 'div';
        const content = element.settings?.text || element.content || '';

        return `<${type} class="bricks-element">${content}</${type}>`;
      })
      .join('\n');
  }
}
