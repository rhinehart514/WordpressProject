import { UUID, URL, Timestamp, RestaurantStatus, Entity, AggregateRoot } from './common';

// Restaurant (Aggregate Root)
export interface Restaurant extends AggregateRoot {
  name: string;
  originalUrl?: URL;
  status: RestaurantStatus;
  ownerUserId: UUID;
  currentSiteUrl?: URL;
  logoUrl?: URL;
}

// Menu Item
export interface MenuItem extends Entity {
  restaurantId: UUID;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: URL;
  category: string;
  allergens?: string[];
  isAvailable: boolean;
  sortOrder?: number;
}

// Operating Hours
export interface OperatingHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
  isClosed: boolean;
}

// Location Info
export interface LocationInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
}

// Gallery Image
export interface GalleryImage extends Entity {
  restaurantId: UUID;
  imageUrl: URL;
  caption?: string;
  sortOrder: number;
  isHeroImage: boolean;
}

// Menu Management (Aggregate Root)
export interface MenuManagement extends AggregateRoot {
  restaurantId: UUID;
  items: MenuItem[];
  categories: string[];
  lastUpdated: Timestamp;
}

// Restaurant Profile (Complete Info)
export interface RestaurantProfile {
  restaurant: Restaurant;
  location: LocationInfo;
  hours: OperatingHours[];
  gallery: GalleryImage[];
  menuItemCount: number;
}

// DTOs
export interface CreateRestaurantDto {
  name: string;
  originalUrl?: URL;
  ownerUserId: UUID;
}

export interface UpdateRestaurantDto {
  name?: string;
  status?: RestaurantStatus;
  logoUrl?: URL;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number; // in dollars
  category: string;
  imageUrl?: URL;
  allergens?: string[];
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {
  isAvailable?: boolean;
}

export interface UpdateLocationDto {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber?: string;
  email?: string;
}

export interface UpdateHoursDto {
  hours: OperatingHours[];
}

export interface AddGalleryImageDto {
  imageUrl: URL;
  caption?: string;
  isHeroImage?: boolean;
}
