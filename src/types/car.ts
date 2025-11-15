export interface Car {
  id: string;
  name: string;
  price: number;
  price_1_3: number;
  price_4_7: number;
  price_8_30: number;
  price_30_plus: number;
  image: string;
  category: string;
  transmission: string;
  seats: number;
  fuelType: string;
  description: string;
  gallery: string[];
  year: number;
}

export interface CarApiResponse {
  cars: Car[];
}

