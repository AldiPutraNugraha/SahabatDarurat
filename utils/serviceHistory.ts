import AsyncStorage from '@react-native-async-storage/async-storage';

const EMERGENCY_HISTORY_KEY = 'emergency_service_history';
const TRANSPORT_HISTORY_KEY = 'patient_transport_bookings';

export interface EmergencyCallHistory {
  id: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  rating?: number;
  notes?: string;
  emergencyType: string;
  estimatedArrival: number;
}

export interface TransportBookingHistory {
  id: string;
  pickupLocation: string;
  destination: string;
  date: string;
  time: string;
  transportType: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'on-the-way' | 'completed' | 'cancelled';
  estimatedCost: number;
  estimatedDuration: number;
  createdAt: string;
  rating?: number;
}

// Fungsi untuk menyimpan riwayat panggilan ambulans darurat
export const saveEmergencyCall = async (
  description: string,
  location: { latitude: number; longitude: number; address: string }
): Promise<void> => {
  try {
    const emergencyCall: EmergencyCallHistory = {
      id: `emergency_${Date.now()}`,
      description,
      location,
      status: 'pending',
      createdAt: new Date().toISOString(),
      emergencyType: 'Darurat',
      estimatedArrival: Math.floor(Math.random() * 15) + 5, // 5-20 menit
    };

    const existingHistory = await AsyncStorage.getItem(EMERGENCY_HISTORY_KEY);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    history.unshift(emergencyCall);
    
    await AsyncStorage.setItem(EMERGENCY_HISTORY_KEY, JSON.stringify(history));
    console.log('Emergency call history saved:', emergencyCall);
  } catch (error) {
    console.error('Error saving emergency call history:', error);
    throw error;
  }
};

// Fungsi untuk update status panggilan ambulans
export const updateEmergencyCallStatus = async (
  callId: string,
  status: EmergencyCallHistory['status']
): Promise<void> => {
  try {
    const existingHistory = await AsyncStorage.getItem(EMERGENCY_HISTORY_KEY);
    if (!existingHistory) return;

    const history = JSON.parse(existingHistory);
    const updatedHistory = history.map((call: EmergencyCallHistory) => {
      if (call.id === callId) {
        return {
          ...call,
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : call.completedAt,
        };
      }
      return call;
    });

    await AsyncStorage.setItem(EMERGENCY_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error updating emergency call status:', error);
    throw error;
  }
};

// Fungsi untuk menambah rating pada panggilan ambulans
export const addEmergencyCallRating = async (
  callId: string,
  rating: number,
  notes?: string
): Promise<void> => {
  try {
    const existingHistory = await AsyncStorage.getItem(EMERGENCY_HISTORY_KEY);
    if (!existingHistory) return;

    const history = JSON.parse(existingHistory);
    const updatedHistory = history.map((call: EmergencyCallHistory) => {
      if (call.id === callId) {
        return {
          ...call,
          rating,
          notes,
        };
      }
      return call;
    });

    await AsyncStorage.setItem(EMERGENCY_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error adding emergency call rating:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua riwayat panggilan ambulans
export const getEmergencyCallHistory = async (): Promise<EmergencyCallHistory[]> => {
  try {
    const history = await AsyncStorage.getItem(EMERGENCY_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting emergency call history:', error);
    return [];
  }
};

// Fungsi untuk mendapatkan semua riwayat booking transportasi
export const getTransportBookingHistory = async (): Promise<TransportBookingHistory[]> => {
  try {
    const history = await AsyncStorage.getItem(TRANSPORT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting transport booking history:', error);
    return [];
  }
};

// Fungsi untuk menghapus riwayat lama (opsional, untuk maintenance)
export const cleanupOldHistory = async (daysToKeep: number = 30): Promise<void> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Cleanup emergency history
    const emergencyHistory = await getEmergencyCallHistory();
    const filteredEmergencyHistory = emergencyHistory.filter(
      (call) => new Date(call.createdAt) > cutoffDate
    );
    await AsyncStorage.setItem(EMERGENCY_HISTORY_KEY, JSON.stringify(filteredEmergencyHistory));

    // Cleanup transport history
    const transportHistory = await getTransportBookingHistory();
    const filteredTransportHistory = transportHistory.filter(
      (booking) => new Date(booking.createdAt) > cutoffDate
    );
    await AsyncStorage.setItem(TRANSPORT_HISTORY_KEY, JSON.stringify(filteredTransportHistory));

    console.log('Old history cleaned up');
  } catch (error) {
    console.error('Error cleaning up old history:', error);
  }
};
