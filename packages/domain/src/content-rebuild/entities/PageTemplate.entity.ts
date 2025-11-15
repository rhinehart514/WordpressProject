import { Entity } from '../../base/Entity';

export enum TemplateType {
  RESTAURANT_CLASSIC = 'restaurant_classic',
  RESTAURANT_MODERN = 'restaurant_modern',
  CAFE = 'cafe',
  FINE_DINING = 'fine_dining',
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
}

export interface PageTemplateData {
  name: string;
  type: TemplateType;
  description?: string;
  heroLayout: string;
  menuLayout: string;
  galleryLayout: string;
  colorScheme: ColorScheme;
  typography: Typography;
}

export class PageTemplate extends Entity<PageTemplateData> {
  private name: string;
  private type: TemplateType;
  private description?: string;
  private heroLayout: string;
  private menuLayout: string;
  private galleryLayout: string;
  private colorScheme: ColorScheme;
  private typography: Typography;
  private isActive: boolean = true;

  constructor(data: PageTemplateData, id?: string) {
    super(id);
    this.name = data.name;
    this.type = data.type;
    this.description = data.description;
    this.heroLayout = data.heroLayout;
    this.menuLayout = data.menuLayout;
    this.galleryLayout = data.galleryLayout;
    this.colorScheme = data.colorScheme;
    this.typography = data.typography;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): TemplateType {
    return this.type;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getHeroLayout(): string {
    return this.heroLayout;
  }

  public getMenuLayout(): string {
    return this.menuLayout;
  }

  public getGalleryLayout(): string {
    return this.galleryLayout;
  }

  public getColorScheme(): ColorScheme {
    return { ...this.colorScheme };
  }

  public getTypography(): Typography {
    return { ...this.typography };
  }

  public activate(): void {
    this.isActive = true;
    this.touch();
  }

  public deactivate(): void {
    this.isActive = false;
    this.touch();
  }

  public isTemplateActive(): boolean {
    return this.isActive;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      description: this.description,
      heroLayout: this.heroLayout,
      menuLayout: this.menuLayout,
      galleryLayout: this.galleryLayout,
      colorScheme: this.colorScheme,
      typography: this.typography,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
