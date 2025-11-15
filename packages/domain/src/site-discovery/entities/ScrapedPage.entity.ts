import { Entity } from '../../base/Entity';
import { URL } from '../value-objects/URL';
import { PageType, PageTypeEnum } from '../value-objects/PageType';
import { ContentBlock } from './ContentBlock.entity';
import { ExtractedAsset } from './ExtractedAsset.entity';

export interface ScrapedPageData {
  url: string;
  rawContent: any;
}

export class ScrapedPage extends Entity<ScrapedPageData> {
  private url: URL;
  private pageType?: PageType;
  private rawContent: any;
  private blocks: ContentBlock[] = [];
  private assets: ExtractedAsset[] = [];

  constructor(data: ScrapedPageData, id?: string) {
    super(id);
    this.url = new URL(data.url);
    this.rawContent = data.rawContent;
  }

  public getUrl(): URL {
    return this.url;
  }

  public getPageType(): PageType | undefined {
    return this.pageType;
  }

  public getRawContent(): any {
    return this.rawContent;
  }

  public getBlocks(): ContentBlock[] {
    return [...this.blocks];
  }

  public getAssets(): ExtractedAsset[] {
    return [...this.assets];
  }

  public classify(type: PageTypeEnum, confidence: number): void {
    this.pageType = new PageType(type, confidence);
    this.touch();
  }

  public addBlock(block: ContentBlock): void {
    this.blocks.push(block);
    this.touch();
  }

  public addBlocks(blocks: ContentBlock[]): void {
    this.blocks.push(...blocks);
    this.touch();
  }

  public addAsset(asset: ExtractedAsset): void {
    this.assets.push(asset);
    this.touch();
  }

  public addAssets(assets: ExtractedAsset[]): void {
    this.assets.push(...assets);
    this.touch();
  }

  public getBlockCount(): number {
    return this.blocks.length;
  }

  public getAssetCount(): number {
    return this.assets.length;
  }

  public isClassified(): boolean {
    return this.pageType !== undefined;
  }

  public toJSON() {
    return {
      id: this.id,
      url: this.url.getValue(),
      pageType: this.pageType?.getType(),
      confidence: this.pageType?.getConfidence(),
      blockCount: this.blocks.length,
      assetCount: this.assets.length,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
