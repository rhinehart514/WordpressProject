import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { WordPressService, WordPressCredentials } from '../modules/wordpress';

export interface DeployToWordPressParams {
  rebuildId: string;
  credentials: WordPressCredentials;
  publishImmediately?: boolean;
}

export interface DeploymentPageResult {
  pageId: string;
  wordPressId?: number;
  title: string;
  status: 'success' | 'failed';
  url?: string;
  error?: string;
}

export interface DeployToWordPressResult {
  deploymentId: string;
  rebuildId: string;
  status: 'deploying' | 'completed' | 'failed';
  pages: DeploymentPageResult[];
  totalPages: number;
  successfulPages: number;
  failedPages: number;
  error?: string;
}

@Injectable()
export class DeployToWordPressUseCase {
  private readonly logger = new Logger(DeployToWordPressUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wordpressService: WordPressService,
  ) {}

  /**
   * Deploy a rebuild to WordPress
   */
  async execute(
    params: DeployToWordPressParams,
  ): Promise<DeployToWordPressResult> {
    const { rebuildId, credentials, publishImmediately = false } = params;

    this.logger.log(`Starting WordPress deployment for rebuild: ${rebuildId}`);

    try {
      // Step 1: Test WordPress connection
      const connectionTest = await this.wordpressService.testConnection(credentials);

      if (!connectionTest.success) {
        throw new Error(`WordPress connection failed: ${connectionTest.error}`);
      }

      this.logger.log(`WordPress connection successful (v${connectionTest.version})`);

      // Step 2: Get rebuild data with pages
      const rebuild = await this.prisma.siteRebuild.findUnique({
        where: { id: rebuildId },
        include: {
          pages: true,
          siteAnalysis: true,
        },
      });

      if (!rebuild) {
        throw new Error('Rebuild not found');
      }

      if (rebuild.pages.length === 0) {
        throw new Error('No pages found in rebuild');
      }

      // Step 3: Create deployment record
      const deployment = await this.prisma.wordPressDeployment.create({
        data: {
          rebuildId,
          targetSiteUrl: credentials.baseUrl,
          status: 'deploying',
          deployedPages: 0,
          totalPages: rebuild.pages.length,
          metadata: {
            startedAt: new Date().toISOString(),
            publishImmediately,
          },
        },
      });

      // Step 4: Deploy each page
      const pageResults: DeploymentPageResult[] = [];

      for (const page of rebuild.pages) {
        try {
          this.logger.log(`Deploying page: ${page.title}`);

          // Convert Bricks elements to WordPress format
          const content = this.wordpressService.convertBricksElements(
            page.elements as any[],
          );

          // Create page in WordPress
          const result = await this.wordpressService.createPage(credentials, {
            title: page.title,
            content,
            status: publishImmediately ? 'publish' : 'draft',
            slug: page.slug,
            meta: {
              bricks_page_data: JSON.stringify(page.elements),
              bricks_page_type: page.pageType,
            },
          });

          if (result.success) {
            pageResults.push({
              pageId: page.id,
              wordPressId: result.pageId,
              title: page.title,
              status: 'success',
              url: result.pageUrl,
            });
          } else {
            pageResults.push({
              pageId: page.id,
              title: page.title,
              status: 'failed',
              error: result.error,
            });
          }
        } catch (error) {
          this.logger.error(`Failed to deploy page: ${page.title}`, error);

          pageResults.push({
            pageId: page.id,
            title: page.title,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Step 5: Update deployment record
      const successfulPages = pageResults.filter((p) => p.status === 'success').length;
      const failedPages = pageResults.filter((p) => p.status === 'failed').length;

      await this.prisma.wordPressDeployment.update({
        where: { id: deployment.id },
        data: {
          status: failedPages > 0 ? 'partial' : 'completed',
          deployedPages: successfulPages,
          metadata: {
            ...(deployment.metadata as any),
            completedAt: new Date().toISOString(),
            pageResults,
          },
        },
      });

      this.logger.log(
        `Deployment completed: ${successfulPages}/${rebuild.pages.length} pages successful`,
      );

      return {
        deploymentId: deployment.id,
        rebuildId,
        status: failedPages > 0 ? 'failed' : 'completed',
        pages: pageResults,
        totalPages: rebuild.pages.length,
        successfulPages,
        failedPages,
      };
    } catch (error) {
      this.logger.error('Deployment failed', error);

      return {
        deploymentId: '',
        rebuildId,
        status: 'failed',
        pages: [],
        totalPages: 0,
        successfulPages: 0,
        failedPages: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get deployment status
   */
  async getStatus(deploymentId: string): Promise<{
    status: string;
    deployedPages: number;
    totalPages: number;
    metadata: any;
  }> {
    const deployment = await this.prisma.wordPressDeployment.findUnique({
      where: { id: deploymentId },
    });

    if (!deployment) {
      throw new Error('Deployment not found');
    }

    return {
      status: deployment.status,
      deployedPages: deployment.deployedPages,
      totalPages: deployment.totalPages,
      metadata: deployment.metadata,
    };
  }

  /**
   * List all deployments for a rebuild
   */
  async listDeployments(rebuildId: string): Promise<any[]> {
    const deployments = await this.prisma.wordPressDeployment.findMany({
      where: { rebuildId },
      orderBy: { createdAt: 'desc' },
    });

    return deployments.map((deployment) => ({
      id: deployment.id,
      status: deployment.status,
      targetSiteUrl: deployment.targetSiteUrl,
      deployedPages: deployment.deployedPages,
      totalPages: deployment.totalPages,
      createdAt: deployment.createdAt,
      metadata: deployment.metadata,
    }));
  }
}
