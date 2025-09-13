export interface Haircut {
  id: string;
  date: string; // Stored in "YYYY-MM-DD" format
  style: string;
  notes?: string;
  images?: string[]; // Array of base64 encoded image strings
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  rating?: number;
  barbershop?: string;
  barber?: string;
  cost?: {
    amount: number;
    currency: string;
  };
}