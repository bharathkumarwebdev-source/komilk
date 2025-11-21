import { Product, ProductCategory } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cow Milk',
    description: 'Pure, unprocessed milk directly from our farms. Rich in nutrients and daily goodness.',
    price: 45,
    category: ProductCategory.DAIRY,
    image: '/images/co.avif',
    nutritionHighlights: ['Protein Rich', 'Calcium', 'Farm Fresh'],
    fatContent: '3.8%',
    volume: '1 Litre'
  },
  {
    id: '2',
    name: 'Buffalo Milk',
    description: 'Creamy and thick buffalo milk, perfect for curd, tea, and traditional sweets.',
    price: 75,
    category: ProductCategory.DAIRY,
    image: '/images/buf.avif',
    nutritionHighlights: ['High Fat', 'Rich Taste', 'Calcium'],
    fatContent: '6.5%',
    volume: '1 Litre'
  },
  {
    id: '3',
    name: 'Native Cow Milk',
    description: 'Premium A2 milk from indigenous cow breeds. Easier to digest and highly nutritious.',
    price: 120,
    category: ProductCategory.ARTISANAL,
    image: '/images/native cow.avif',
    nutritionHighlights: ['A2 Protein', 'Easy Digestion', 'Premium'],
    fatContent: '4.0%',
    volume: '1 Litre'
  }
];

export const COMPANY_INFO = {
  name: "KO-MILK",
  tagline: "Milk as Milked, Delivered as Milked",
  address: "2/182, Ko-Milk Collection Center, Sengodampalayam, Namakkal - 637019",
  phone: "+91 8760629867"
};