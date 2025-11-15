import { Entity } from '../../base/Entity';
import { URL } from '../value-objects/URL';

export type AssetType = 'image' | 'video' | 'file';

export interface ExtractedAssetData {
  url: string;
  type: AssetType;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

export class ExtractedAsset extends Entity<ExtractedAssetData> {
  private url: URL;
  private type: AssetType;
  private alt?: string;
  private title?: string;
  private width?: number;
  private height?: number;

  constructor(data: ExtractedAssetData, id?: string) {
    super(id);
    this.url = new URL(data.url);
    this.type = data.type;
    this.alt = data.alt;
    this.title = data.title;
    this.width = data.width;
    this.height = data.height;
  }

  public getUrl(): URL {
    return this.url;
  }

  public getType(): AssetType {
    return this.type;
  }

  public getAlt(): string | undefined {
    return this.alt;
  }

  public getTitle(): string | undefined {
    return this.title;
  }

  public getDimensions(): { width?: number; height?: number } {
    return { width: this.width, height: this.height };
  }

  public updateMetadata(metadata: {
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
  }): void {
    if (metadata.alt !== undefined) this.alt = metadata.alt;
    if (metadata.title !== undefined) this.title = metadata.title;
    if (metadata.width !== undefined) this.width = metadata.width;
    if (metadata.height !== undefined) this.height = metadata.height;
    this.touch();
  }

  public isImage(): boolean {
    return this.type === 'image';
  }

  public toJSON() {
    return {
      id: this.id,
      url: this.url.getValue(),
      type: this.type,
      alt: this.alt,
      title: this.title,
      width: this.width,
      height: this.height,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
