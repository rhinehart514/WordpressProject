import { ValueObject } from '../../base/ValueObject';
import { v4 as uuidv4 } from 'uuid';

export enum BricksElementType {
  SECTION = 'section',
  CONTAINER = 'container',
  BLOCK = 'block',
  DIV = 'div',
  HEADING = 'heading',
  TEXT = 'text-basic',
  IMAGE = 'image',
  BUTTON = 'button',
  DIVIDER = 'divider',
}

export interface BricksElementSettings {
  _cssId?: string;
  _cssClasses?: string[];
  tag?: string;
  text?: string;
  image?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  _background?: {
    image?: { url: string };
    color?: string;
    overlay?: { color: string };
  };
  _padding?: Record<string, string>;
  _margin?: Record<string, string>;
  [key: string]: any;
}

export interface BricksElementData {
  name: BricksElementType | string;
  settings: BricksElementSettings;
  children?: BricksElement[];
}

export class BricksElement extends ValueObject<BricksElementData> {
  private readonly id: string;
  private readonly name: BricksElementType | string;
  private readonly settings: BricksElementSettings;
  private readonly children: BricksElement[];

  constructor(data: BricksElementData) {
    super();
    this.id = uuidv4();
    this.name = data.name;
    this.settings = { ...data.settings };
    this.children = data.children || [];
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getSettings(): BricksElementSettings {
    return { ...this.settings };
  }

  public getChildren(): BricksElement[] {
    return [...this.children];
  }

  public hasChildren(): boolean {
    return this.children.length > 0;
  }

  public getChildCount(): number {
    let count = this.children.length;
    this.children.forEach((child) => {
      count += child.getChildCount();
    });
    return count;
  }

  protected getEqualityComponents(): any[] {
    return [this.name, this.settings, this.children];
  }

  public toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      settings: this.settings,
      ...(this.children.length > 0 && {
        children: this.children.map((child) => child.toJSON()),
      }),
    };
  }

  // Factory methods for common elements
  public static section(settings: BricksElementSettings, children: BricksElement[]): BricksElement {
    return new BricksElement({
      name: BricksElementType.SECTION,
      settings: { tag: 'section', ...settings },
      children,
    });
  }

  public static container(children: BricksElement[], settings: BricksElementSettings = {}): BricksElement {
    return new BricksElement({
      name: BricksElementType.CONTAINER,
      settings,
      children,
    });
  }

  public static heading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', cssClasses?: string[]): BricksElement {
    return new BricksElement({
      name: BricksElementType.HEADING,
      settings: {
        text,
        tag,
        ...(cssClasses && { _cssClasses: cssClasses }),
      },
    });
  }

  public static text(content: string, cssClasses?: string[]): BricksElement {
    return new BricksElement({
      name: BricksElementType.TEXT,
      settings: {
        text: content,
        ...(cssClasses && { _cssClasses: cssClasses }),
      },
    });
  }

  public static image(url: string, alt?: string, cssClasses?: string[]): BricksElement {
    return new BricksElement({
      name: BricksElementType.IMAGE,
      settings: {
        image: { url, alt },
        ...(cssClasses && { _cssClasses: cssClasses }),
      },
    });
  }

  public static button(text: string, link: string, cssClasses?: string[]): BricksElement {
    return new BricksElement({
      name: BricksElementType.BUTTON,
      settings: {
        text,
        link: { url: link },
        ...(cssClasses && { _cssClasses: cssClasses }),
      },
    });
  }
}
