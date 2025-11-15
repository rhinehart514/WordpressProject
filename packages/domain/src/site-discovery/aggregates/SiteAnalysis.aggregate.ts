import { AggregateRoot } from '../../base/AggregateRoot';
import { InvalidOperationException, ValidationException } from '../../exceptions/DomainExceptions';
import { URL } from '../value-objects/URL';
import { ScrapedPage } from '../entities/ScrapedPage.entity';
import { SiteScraped } from '../events/SiteScraped.event';
import { ContentExtracted } from '../events/ContentExtracted.event';
import { AnalysisCompleted } from '../events/AnalysisCompleted.event';

export enum AnalysisStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface SiteMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface SiteAnalysisData {
  url: string;
  status?: AnalysisStatus;
  metadata?: SiteMetadata;
}

export class SiteAnalysis extends AggregateRoot<SiteAnalysisData> {
  private url: URL;
  private status: AnalysisStatus;
  private metadata: SiteMetadata;
  private pages: ScrapedPage[] = [];
  private errorMessage?: string;

  private constructor(data: SiteAnalysisData, id?: string) {
    super(id);
    this.url = new URL(data.url);
    this.status = data.status || AnalysisStatus.PENDING;
    this.metadata = data.metadata || {};
  }

  public static create(url: string): SiteAnalysis {
    return new SiteAnalysis({ url });
  }

  public static reconstitute(
    data: SiteAnalysisData & { id: string; version: number; pages: ScrapedPage[] },
  ): SiteAnalysis {
    const analysis = new SiteAnalysis(data, data.id);
    analysis._version = data.version;
    analysis.pages = data.pages;
    return analysis;
  }

  public getUrl(): URL {
    return this.url;
  }

  public getStatus(): AnalysisStatus {
    return this.status;
  }

  public getMetadata(): SiteMetadata {
    return { ...this.metadata };
  }

  public getPages(): ScrapedPage[] {
    return [...this.pages];
  }

  public getErrorMessage(): string | undefined {
    return this.errorMessage;
  }

  public startAnalysis(): void {
    if (this.status !== AnalysisStatus.PENDING) {
      throw new InvalidOperationException(
        `Cannot start analysis. Current status: ${this.status}`,
      );
    }

    this.status = AnalysisStatus.IN_PROGRESS;
    this.touch();
  }

  public addScrapedPage(page: ScrapedPage): void {
    if (this.status !== AnalysisStatus.IN_PROGRESS) {
      throw new InvalidOperationException(
        `Cannot add pages. Analysis is not in progress.`,
      );
    }

    this.pages.push(page);
    this.addDomainEvent(
      new SiteScraped(this.id, this.pages.length, this.url.getValue()),
    );
    this.touch();
  }

  public addScrapedPages(pages: ScrapedPage[]): void {
    pages.forEach((page) => this.addScrapedPage(page));
  }

  public notifyContentExtracted(pageId: string, blockCount: number, assetCount: number): void {
    this.addDomainEvent(
      new ContentExtracted(this.id, pageId, blockCount, assetCount),
    );
  }

  public updateMetadata(metadata: Partial<SiteMetadata>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.touch();
  }

  public completeAnalysis(): void {
    if (this.status !== AnalysisStatus.IN_PROGRESS) {
      throw new InvalidOperationException(
        `Cannot complete analysis. Current status: ${this.status}`,
      );
    }

    if (this.pages.length === 0) {
      throw new ValidationException('Cannot complete analysis with no pages');
    }

    this.status = AnalysisStatus.COMPLETED;

    const totalBlocks = this.pages.reduce((sum, page) => sum + page.getBlockCount(), 0);

    this.addDomainEvent(
      new AnalysisCompleted(this.id, this.pages.length, totalBlocks, true),
    );

    this.incrementVersion();
    this.touch();
  }

  public failAnalysis(errorMessage: string): void {
    if (this.status === AnalysisStatus.COMPLETED) {
      throw new InvalidOperationException(
        'Cannot fail a completed analysis',
      );
    }

    this.status = AnalysisStatus.FAILED;
    this.errorMessage = errorMessage;

    this.addDomainEvent(
      new AnalysisCompleted(this.id, this.pages.length, 0, false),
    );

    this.touch();
  }

  public isCompleted(): boolean {
    return this.status === AnalysisStatus.COMPLETED;
  }

  public isFailed(): boolean {
    return this.status === AnalysisStatus.FAILED;
  }

  public getPageCount(): number {
    return this.pages.length;
  }

  public getTotalBlockCount(): number {
    return this.pages.reduce((sum, page) => sum + page.getBlockCount(), 0);
  }

  public getTotalAssetCount(): number {
    return this.pages.reduce((sum, page) => sum + page.getAssetCount(), 0);
  }

  public toJSON() {
    return {
      id: this.id,
      url: this.url.getValue(),
      status: this.status,
      metadata: this.metadata,
      pageCount: this.pages.length,
      totalBlocks: this.getTotalBlockCount(),
      totalAssets: this.getTotalAssetCount(),
      errorMessage: this.errorMessage,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
