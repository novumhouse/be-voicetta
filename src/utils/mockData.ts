
import { 
  Activity, 
  BarChart3, 
  BedDouble, 
  Calendar, 
  Check, 
  Clock, 
  HotelIcon, 
  MessageSquare, 
  RefreshCcw, 
  Smartphone, 
  User, 
  X 
} from "lucide-react";

export type Booking = {
  id: string;
  guestName: string;
  propertyName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  totalAmount: number;
  currency: string;
};

export type ApiStatus = {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  lastChecked: string;
  icon: React.ElementType;
};

export type MetricData = {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
};

// Mock bookings data
export const recentBookings: Booking[] = [
  {
    id: 'RB-1234',
    guestName: 'Emma Thompson',
    propertyName: 'Grand Hotel Riviera',
    roomType: 'Deluxe Suite',
    checkIn: '2023-10-15',
    checkOut: '2023-10-18',
    guests: 2,
    status: 'confirmed',
    createdAt: '2023-09-20T14:30:00Z',
    totalAmount: 1250,
    currency: 'USD'
  },
  {
    id: 'RB-1235',
    guestName: 'James Wilson',
    propertyName: 'Seaside Resort',
    roomType: 'Ocean View Room',
    checkIn: '2023-10-10',
    checkOut: '2023-10-12',
    guests: 1,
    status: 'confirmed',
    createdAt: '2023-09-19T09:15:00Z',
    totalAmount: 780,
    currency: 'USD'
  },
  {
    id: 'RB-1236',
    guestName: 'Sophia Martinez',
    propertyName: 'Mountain Lodge',
    roomType: 'Family Cabin',
    checkIn: '2023-10-20',
    checkOut: '2023-10-24',
    guests: 4,
    status: 'pending',
    createdAt: '2023-09-21T11:45:00Z',
    totalAmount: 1680,
    currency: 'USD'
  },
  {
    id: 'RB-1237',
    guestName: 'Michael Brown',
    propertyName: 'City Center Hotel',
    roomType: 'Executive Room',
    checkIn: '2023-10-08',
    checkOut: '2023-10-10',
    guests: 1,
    status: 'cancelled',
    createdAt: '2023-09-15T16:20:00Z',
    totalAmount: 560,
    currency: 'USD'
  },
  {
    id: 'RB-1238',
    guestName: 'Olivia Johnson',
    propertyName: 'Grand Hotel Riviera',
    roomType: 'Premier Suite',
    checkIn: '2023-10-25',
    checkOut: '2023-10-28',
    guests: 2,
    status: 'confirmed',
    createdAt: '2023-09-22T10:00:00Z',
    totalAmount: 1450,
    currency: 'USD'
  }
];

// Mock API status data
export const apiStatusData: ApiStatus[] = [
  {
    name: 'Retell AI Webhook',
    status: 'operational',
    latency: 45,
    lastChecked: '2023-09-22T14:58:00Z',
    icon: MessageSquare
  },
  {
    name: 'YieldPlanet API',
    status: 'operational',
    latency: 120,
    lastChecked: '2023-09-22T14:58:00Z',
    icon: HotelIcon
  },
  {
    name: 'Booking Engine',
    status: 'operational',
    latency: 35,
    lastChecked: '2023-09-22T14:58:00Z',
    icon: Calendar
  },
  {
    name: 'Database',
    status: 'operational',
    latency: 15,
    lastChecked: '2023-09-22T14:58:00Z',
    icon: BarChart3
  }
];

// Mock metrics data
export const metricsData: MetricData[] = [
  {
    label: 'Total Bookings',
    value: 128,
    change: 12.5,
    icon: Calendar
  },
  {
    label: 'Conversion Rate',
    value: '24.8%',
    change: 3.2,
    icon: Activity
  },
  {
    label: 'Avg. Response Time',
    value: '280ms',
    change: -8.5,
    icon: Clock
  },
  {
    label: 'Active Users',
    value: 47,
    change: 15.3,
    icon: User
  }
];

export const getStatusIcon = (status: 'operational' | 'degraded' | 'down') => {
  switch (status) {
    case 'operational':
      return Check;
    case 'degraded':
      return RefreshCcw;
    case 'down':
      return X;
    default:
      return Check;
  }
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
