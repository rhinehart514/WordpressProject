import { Entity } from '../../base/Entity';

export enum ContentBlockType {
  HERO = 'hero',
  TEXT = 'text',
  IMAGE = 'image',
  GALLERY = 'gallery',
  MENU_SECTION = 'menu_section',
  MENU_ITEM = 'menu_item',
  CONTACT_INFO = 'contact_info',
  HOURS = 'hours',
  CTA = 'cta',
  FOOTER = 'footer',
}

export interface ContentBlockData {
  blockType: ContentBlockType;
  content: Record<string, any>;
  position: number;
}

export class ContentBlock extends Entity<ContentBlockData> {
  private blockType: ContentBlockType;
  private content: Record<string, any>;
  private position: number;

  constructor(data: ContentBlockData, id?: string) {
    super(id);
    this.blockType = data.blockType;
    this.content = data.content;
    this.position = data.position;
  }

  public getBlockType(): ContentBlockType {
    return this.blockType;
  }

  public getContent(): Record<string, any> {
    return { ...this.content };
  }

  public getPosition(): number {
    return this.position;
  }

  public updateContent(newContent: Record<string, any>): void {
    this.content = { ...this.content, ...newContent };
    this.touch();
  }

  public updatePosition(newPosition: number): void {
    if (newPosition < 0) {
      throw new Error('Position must be non-negative');
    }
    this.position = newPosition;
    this.touch();
  }

  public toJSON() {
    return {
      id: this.id,
      blockType: this.blockType,
      content: this.content,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
