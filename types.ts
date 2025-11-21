
export enum ProductCategory {
  DAIRY = 'Dairy',
  PLANT_BASED = 'Plant-Based',
  FLAVORED = 'Flavored',
  ARTISANAL = 'Artisanal'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  nutritionHighlights: string[];
  fatContent: string;
  volume: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type ViewState = 'HOME' | 'MILK' | 'ABOUT' | 'CONTACT' | 'CAREERS' | 'WRITE_US' | 'CAREER_BUSINESS_ADMIN' | 'CAREER_WEB_APP_MGMT' | 'CAREER_MARKETING' | 'CAREER_VENDORS_DEV' | 'CAREER_LOGISTICS' | 'CAREER_DIST_DELIVERY' | 'TERMS';
