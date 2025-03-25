
import { toast } from "@/hooks/use-toast";

// API base URL - would point to FastAPI server in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.hotelconnect.example.com";

// Types for our API responses
export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  version: string;
  uptime: number;
  dependencies: {
    yieldplanet: "ok" | "degraded" | "down";
    database: "ok" | "degraded" | "down";
  };
}

export interface Availability {
  propertyId: string;
  startDate: string;
  endDate: string;
  rooms: Array<{
    id: string;
    name: string;
    description: string;
    maxOccupancy: number;
    price: number;
    currency: string;
    available: boolean;
  }>;
}

export interface Reservation {
  id: string;
  propertyId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalPrice: number;
  currency: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  contactEmail: string;
  contactPhone: string;
  facilities: string[];
  images: string[];
}

// API service class
class ApiService {
  private apiKey: string | null = null;

  // Set API key for authentication
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem("hotelconnect_api_key", key);
  }

  // Get API key from storage
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem("hotelconnect_api_key");
    }
    return this.apiKey;
  }

  // Clear API key
  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem("hotelconnect_api_key");
  }

  // Default headers with authentication
  private get headers() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    const apiKey = this.getApiKey();
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
    
    return headers;
  }

  // Generic fetch wrapper with error handling
  private async fetchWithErrorHandling<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: this.headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      toast({
        title: "API Request Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }

  // API endpoints
  async getHealthStatus(): Promise<HealthStatus> {
    return this.fetchWithErrorHandling<HealthStatus>("/api/health");
  }

  async getAvailability(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<Availability> {
    return this.fetchWithErrorHandling<Availability>(
      `/api/availability?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  async createReservation(reservationData: Omit<Reservation, "id" | "createdAt" | "updatedAt">): Promise<Reservation> {
    return this.fetchWithErrorHandling<Reservation>("/api/reservations", {
      method: "POST",
      body: JSON.stringify(reservationData),
    });
  }

  async updateReservation(id: string, updateData: Partial<Reservation>): Promise<Reservation> {
    return this.fetchWithErrorHandling<Reservation>(`/api/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async getProperty(id: string): Promise<Property> {
    return this.fetchWithErrorHandling<Property>(`/api/properties/${id}`);
  }

  // Mock API for development - returns fake data for testing the UI
  async getMockHealthStatus(): Promise<HealthStatus> {
    return {
      status: "ok",
      version: "1.0.0",
      uptime: 3600,
      dependencies: {
        yieldplanet: "ok",
        database: "ok"
      }
    };
  }

  async getMockAvailability(): Promise<Availability> {
    return {
      propertyId: "prop123",
      startDate: "2023-10-12",
      endDate: "2023-10-15",
      rooms: [
        {
          id: "room1",
          name: "Deluxe King Room",
          description: "Spacious room with king-sized bed",
          maxOccupancy: 2,
          price: 150,
          currency: "USD",
          available: true
        },
        {
          id: "room2",
          name: "Twin Room",
          description: "Room with two single beds",
          maxOccupancy: 2,
          price: 120,
          currency: "USD",
          available: true
        }
      ]
    };
  }

  async getMockReservations(): Promise<Reservation[]> {
    return [
      {
        id: "res1",
        propertyId: "prop123",
        roomId: "room1",
        guestName: "John Doe",
        guestEmail: "john@example.com",
        checkIn: "2023-10-12",
        checkOut: "2023-10-15",
        adults: 2,
        children: 0,
        totalPrice: 450,
        currency: "USD",
        status: "confirmed",
        createdAt: "2023-10-01T12:00:00Z",
        updatedAt: "2023-10-01T12:00:00Z"
      },
      {
        id: "res2",
        propertyId: "prop123",
        roomId: "room2",
        guestName: "Jane Smith",
        guestEmail: "jane@example.com",
        checkIn: "2023-10-20",
        checkOut: "2023-10-22",
        adults: 1,
        children: 1,
        totalPrice: 240,
        currency: "USD",
        status: "pending",
        createdAt: "2023-10-05T09:30:00Z",
        updatedAt: "2023-10-05T09:30:00Z"
      }
    ];
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
