import { AggregateRoot } from '../../base/AggregateRoot';
import { InvalidOperationException, ValidationException } from '../../exceptions/DomainExceptions';
import { BricksPageStructure } from '../entities/BricksPageStructure.entity';
import { PageTemplate } from '../entities/PageTemplate.entity';
import { RebuildGenerated } from '../events/RebuildGenerated.event';
import { PreviewCreated, PreviewUrls } from '../events/PreviewCreated.event';

export enum RebuildStatus {
  PENDING = 'pending',
  GENERATED = 'generated',
  PREVIEW_READY = 'preview_ready',
  FAILED = 'failed',
}

export interface SiteRebuildData {
  siteAnalysisId: string;
  templateId: string;
  status?: RebuildStatus;
}

export class SiteRebuild extends AggregateRoot<SiteRebuildData> {
  private siteAnalysisId: string;
  private templateId: string;
  private status: RebuildStatus;
  private pages: Map<string, BricksPageStructure> = new Map();
  private previewUrls?: PreviewUrls;
  private errorMessage?: string;

  private constructor(data: SiteRebuildData, id?: string) {
    super(id);
    this.siteAnalysisId = data.siteAnalysisId;
    this.templateId = data.templateId;
    this.status = data.status || RebuildStatus.PENDING;
  }

  public static create(siteAnalysisId: string, templateId: string): SiteRebuild {
    return new SiteRebuild({ siteAnalysisId, templateId });
  }

  public static reconstitute(
    data: SiteRebuildData & {
      id: string;
      version: number;
      pages: BricksPageStructure[];
      previewUrls?: PreviewUrls;
    },
  ): SiteRebuild {
    const rebuild = new SiteRebuild(data, data.id);
    rebuild._version = data.version;

    // Convert pages array to Map
    data.pages.forEach((page) => {
      rebuild.pages.set(page.getPageType(), page);
    });

    rebuild.previewUrls = data.previewUrls;
    return rebuild;
  }

  public getSiteAnalysisId(): string {
    return this.siteAnalysisId;
  }

  public getTemplateId(): string {
    return this.templateId;
  }

  public getStatus(): RebuildStatus {
    return this.status;
  }

  public getPages(): BricksPageStructure[] {
    return Array.from(this.pages.values());
  }

  public getPageByType(pageType: string): BricksPageStructure | undefined {
    return this.pages.get(pageType);
  }

  public getPreviewUrls(): PreviewUrls | undefined {
    return this.previewUrls ? { ...this.previewUrls } : undefined;
  }

  public getErrorMessage(): string | undefined {
    return this.errorMessage;
  }

  public addPage(page: BricksPageStructure): void {
    if (this.status === RebuildStatus.FAILED) {
      throw new InvalidOperationException('Cannot add pages to failed rebuild');
    }

    this.pages.set(page.getPageType(), page);
    this.touch();
  }

  public addPages(pages: BricksPageStructure[]): void {
    pages.forEach((page) => this.addPage(page));
  }

  public completeGeneration(): void {
    if (this.status !== RebuildStatus.PENDING) {
      throw new InvalidOperationException(
        `Cannot complete generation. Current status: ${this.status}`,
      );
    }

    if (this.pages.size === 0) {
      throw new ValidationException('Cannot complete rebuild with no pages');
    }

    this.status = RebuildStatus.GENERATED;

    this.addDomainEvent(
      new RebuildGenerated(this.id, this.pages.size, this.templateId),
    );

    this.incrementVersion();
    this.touch();
  }

  public setPreviewUrls(urls: PreviewUrls): void {
    if (this.status !== RebuildStatus.GENERATED) {
      throw new InvalidOperationException(
        'Can only set preview URLs after generation is complete',
      );
    }

    this.previewUrls = urls;
    this.status = RebuildStatus.PREVIEW_READY;

    this.addDomainEvent(new PreviewCreated(this.id, urls));

    this.incrementVersion();
    this.touch();
  }

  public fail(errorMessage: string): void {
    this.status = RebuildStatus.FAILED;
    this.errorMessage = errorMessage;
    this.touch();
  }

  public isReady(): boolean {
    return this.status === RebuildStatus.PREVIEW_READY;
  }

  public isFailed(): boolean {
    return this.status === RebuildStatus.FAILED;
  }

  public getPageCount(): number {
    return this.pages.size;
  }

  public getTotalElementCount(): number {
    return Array.from(this.pages.values()).reduce(
      (sum, page) => sum + page.getElementCount(),
      0,
    );
  }

  public hasPage(pageType: string): boolean {
    return this.pages.has(pageType);
  }

  public toJSON() {
    return {
      id: this.id,
      siteAnalysisId: this.siteAnalysisId,
      templateId: this.templateId,
      status: this.status,
      pageCount: this.pages.size,
      totalElements: this.getTotalElementCount(),
      previewUrls: this.previewUrls,
      errorMessage: this.errorMessage,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
