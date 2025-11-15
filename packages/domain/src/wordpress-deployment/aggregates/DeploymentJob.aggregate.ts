import { AggregateRoot } from '../../base/AggregateRoot';
import { InvalidOperationException, ValidationException } from '../../exceptions/DomainExceptions';
import { DeploymentQueued } from '../events/DeploymentQueued.event';
import { PagePublished } from '../events/PagePublished.event';
import { DeploymentCompleted } from '../events/DeploymentCompleted.event';

export enum DeploymentStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
}

export interface DeployedPageInfo {
  pageType: string;
  wordpressPageId: number;
  url: string;
  editUrl: string;
}

export interface DeploymentJobData {
  rebuildId: string;
  wordPressSiteId: string;
  status?: DeploymentStatus;
}

export class DeploymentJob extends AggregateRoot<DeploymentJobData> {
  private rebuildId: string;
  private wordPressSiteId: string;
  private status: DeploymentStatus;
  private deployedPages: Map<string, DeployedPageInfo> = new Map();
  private errorLog: string[] = [];
  private completedAt?: Date;

  private constructor(data: DeploymentJobData, id?: string) {
    super(id);
    this.rebuildId = data.rebuildId;
    this.wordPressSiteId = data.wordPressSiteId;
    this.status = data.status || DeploymentStatus.QUEUED;
  }

  public static create(rebuildId: string, wordPressSiteId: string): DeploymentJob {
    const job = new DeploymentJob({ rebuildId, wordPressSiteId });

    job.addDomainEvent(
      new DeploymentQueued(job.id, rebuildId, wordPressSiteId),
    );

    return job;
  }

  public static reconstitute(
    data: DeploymentJobData & {
      id: string;
      version: number;
      deployedPages: DeployedPageInfo[];
      errorLog?: string[];
      completedAt?: Date;
    },
  ): DeploymentJob {
    const job = new DeploymentJob(data, data.id);
    job._version = data.version;

    // Convert deployedPages array to Map
    data.deployedPages.forEach((pageInfo) => {
      job.deployedPages.set(pageInfo.pageType, pageInfo);
    });

    job.errorLog = data.errorLog || [];
    job.completedAt = data.completedAt;

    return job;
  }

  public getRebuildId(): string {
    return this.rebuildId;
  }

  public getWordPressSiteId(): string {
    return this.wordPressSiteId;
  }

  public getStatus(): DeploymentStatus {
    return this.status;
  }

  public getDeployedPages(): DeployedPageInfo[] {
    return Array.from(this.deployedPages.values());
  }

  public getErrorLog(): string[] {
    return [...this.errorLog];
  }

  public getCompletedAt(): Date | undefined {
    return this.completedAt;
  }

  public startDeployment(): void {
    if (this.status !== DeploymentStatus.QUEUED) {
      throw new InvalidOperationException(
        `Cannot start deployment. Current status: ${this.status}`,
      );
    }

    this.status = DeploymentStatus.IN_PROGRESS;
    this.touch();
  }

  public recordPageDeployment(pageInfo: DeployedPageInfo): void {
    if (this.status !== DeploymentStatus.IN_PROGRESS) {
      throw new InvalidOperationException(
        'Cannot record page deployment. Job is not in progress.',
      );
    }

    this.deployedPages.set(pageInfo.pageType, pageInfo);

    this.addDomainEvent(
      new PagePublished(
        this.id,
        pageInfo.pageType,
        pageInfo.wordpressPageId,
        pageInfo.url,
      ),
    );

    this.touch();
  }

  public recordError(error: string): void {
    this.errorLog.push(`[${new Date().toISOString()}] ${error}`);
    this.touch();
  }

  public completeDeployment(): void {
    if (this.status !== DeploymentStatus.IN_PROGRESS) {
      throw new InvalidOperationException(
        `Cannot complete deployment. Current status: ${this.status}`,
      );
    }

    if (this.deployedPages.size === 0) {
      throw new ValidationException('Cannot complete deployment with no deployed pages');
    }

    this.status = DeploymentStatus.COMPLETED;
    this.completedAt = new Date();

    this.addDomainEvent(
      new DeploymentCompleted(
        this.id,
        true,
        this.deployedPages.size,
        this.errorLog.length,
      ),
    );

    this.incrementVersion();
    this.touch();
  }

  public failDeployment(errorMessage: string): void {
    if (this.status === DeploymentStatus.COMPLETED) {
      throw new InvalidOperationException(
        'Cannot fail a completed deployment',
      );
    }

    this.recordError(errorMessage);
    this.status = DeploymentStatus.FAILED;
    this.completedAt = new Date();

    this.addDomainEvent(
      new DeploymentCompleted(
        this.id,
        false,
        this.deployedPages.size,
        this.errorLog.length,
      ),
    );

    this.touch();
  }

  public rollback(): void {
    if (this.status !== DeploymentStatus.COMPLETED && this.status !== DeploymentStatus.FAILED) {
      throw new InvalidOperationException(
        'Can only rollback completed or failed deployments',
      );
    }

    this.status = DeploymentStatus.ROLLED_BACK;
    this.recordError('Deployment rolled back');
    this.touch();
  }

  public isCompleted(): boolean {
    return this.status === DeploymentStatus.COMPLETED;
  }

  public isFailed(): boolean {
    return this.status === DeploymentStatus.FAILED;
  }

  public hasErrors(): boolean {
    return this.errorLog.length > 0;
  }

  public getDeployedPageCount(): number {
    return this.deployedPages.size;
  }

  public getPageInfo(pageType: string): DeployedPageInfo | undefined {
    return this.deployedPages.get(pageType);
  }

  public getDuration(): number | undefined {
    if (!this.completedAt) return undefined;
    return this.completedAt.getTime() - this.createdAt.getTime();
  }

  public toJSON() {
    return {
      id: this.id,
      rebuildId: this.rebuildId,
      wordPressSiteId: this.wordPressSiteId,
      status: this.status,
      deployedPageCount: this.deployedPages.size,
      errorCount: this.errorLog.length,
      completedAt: this.completedAt,
      duration: this.getDuration(),
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
