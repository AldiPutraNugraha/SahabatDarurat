// Types untuk aplikasi SahabatDarurat

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  emergencyContacts: EmergencyContact[];
  medicalInfo?: MedicalInfo;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface MedicalInfo {
  bloodType?: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
}

export interface AmbulanceDriver {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  rating: number;
  vehicleNumber: string;
  hospitalAffiliation?: string;
}

export interface Ambulance {
  id: string;
  driver: AmbulanceDriver;
  location: Location;
  isAvailable: boolean;
  type: 'emergency' | 'non-emergency' | 'transport';
  estimatedArrival?: number; // in minutes
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  location: Location;
  serviceType: 'emergency' | 'non-emergency' | 'transport';
  description: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'arrived' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  ambulanceId?: string;
  estimatedArrival?: number;
  rating?: number;
  notes?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: Location;
  phone: string;
  specialties: string[];
  emergencyServices: boolean;
  rating: number;
  distance?: number; // in km
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderType: 'user' | 'driver';
  message: string;
  timestamp: Date;
  isRead: boolean;
}
