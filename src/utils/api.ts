import { Car } from '../types/car';

interface InquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupdate: string;
  dropoffdate: string;
  carid: string;
  message?: string;
  totalPrice: number;
}

const API_BASE_URL = 'https://autonikapi.vercel.app';
const MAILER_API_URL = 'https://avtonikmailer.vercel.app';

export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars-data`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data structure received from API");
    }

    const cars: Car[] = data.map((car: any) => ({
      id: car.id.toString(),
      name: car.name,
      price: car.price,
      image: car.image,
      category: car.category,
      transmission: car.transmission,
      seats: car.seats,
      fuelType: car.fuelType,
      description: car.description,
      gallery: car.gallery,
      year: car.year,
    }));

    return cars;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
}

export async function sendInquiry(formData: InquiryFormData): Promise<Response> {
  const response = await fetch(
    `${MAILER_API_URL}/api/send-mail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error response:", errorText);
    console.error("Response status:", response.status);
    console.error("Response headers:", Object.fromEntries(response.headers.entries()));
    throw new Error(`Failed to send inquiry: ${response.status} ${response.statusText}`);
  }

  return response;
}

