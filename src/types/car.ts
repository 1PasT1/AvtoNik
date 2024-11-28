export interface Car {
  id: string;
  name: string;
  price: number;
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

