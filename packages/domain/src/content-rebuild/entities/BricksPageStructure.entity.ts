import { Entity } from '../../base/Entity';
import { BricksElement } from '../value-objects/BricksElement';
import { PageTypeEnum } from '../../site-discovery/value-objects/PageType';

export interface BricksPageStructureData {
  pageType: PageTypeEnum;
  title: string;
  slug: string;
  elements: BricksElement[];
}

export class BricksPageStructure extends Entity<BricksPageStructureData> {
  private pageType: PageTypeEnum;
  private title: string;
  private slug: string;
  private elements: BricksElement[];

  constructor(data: BricksPageStructureData, id?: string) {
    super(id);
    this.pageType = data.pageType;
    this.title = data.title;
    this.slug = data.slug;
    this.elements = data.elements;
  }

  public getPageType(): PageTypeEnum {
    return this.pageType;
  }

  public getTitle(): string {
    return this.title;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getElements(): BricksElement[] {
    return [...this.elements];
  }

  public getElementCount(): number {
    let count = this.elements.length;
    this.elements.forEach((element) => {
      count += element.getChildCount();
    });
    return count;
  }

  public addElement(element: BricksElement): void {
    this.elements.push(element);
    this.touch();
  }

  public updateTitle(newTitle: string): void {
    this.title = newTitle;
    this.touch();
  }

  public toJSON() {
    return {
      id: this.id,
      pageType: this.pageType,
      title: this.title,
      slug: this.slug,
      elements: this.elements.map((el) => el.toJSON()),
      elementCount: this.getElementCount(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
