import { Car } from '../types/car';

export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await fetch('https://autonikapi.vercel.app/api/cars-data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data structure received from API');
    }
    
    const cars: Car[] = data.map((car: any) => ({
      ...car,
      id: car.id.toString()
    }));
    
    return cars;
  } catch (error) {
    throw error;
  }
}

export async function sendInquiry(formData: any): Promise<Response> {
  const response = await fetch('https://autonikapi.vercel.app/api/send-mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to send inquiry');
  }

  return response;
}

