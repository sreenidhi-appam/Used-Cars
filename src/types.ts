export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  bodyType: 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'Coupe';
  isCertified: boolean;
  image: string;
  power: string;
  engine: string;
  owners: number;
  color: string;
  rating: number;
  features: string[];
  location?: string;
  formattedPrice?: string;
  seating?: number;
}

export interface Blog {
  id: string;
  title: string;
  category: 'Buying Guides' | 'Car Reviews' | 'Maintenance Tips' | 'Market Trends';
  summary: string;
  content: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  inventoryCount: number;
  image: string;
}

export interface ServiceBooking {
  id: string;
  serviceType: 'RC Transfer' | 'Insurance Renewal' | 'Vehicle Inspection' | 'Fastag' | 'Roadside Assistance';
  name: string;
  phone: string;
  carNumber: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface ValuationResult {
  estimatedLow: number;
  estimatedHigh: number;
  excellentPrice: number;
  goodPrice: number;
  fairPrice: number;
}
