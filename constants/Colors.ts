/**
 * SahabatDarurat App Colors - Medical Emergency Theme
 * Primary colors: Red for emergency, White for clean medical feel
 */

const emergencyRed = '#DC2626'; // Red-600
const emergencyRedDark = '#B91C1C'; // Red-700
const emergencyRedLight = '#FEE2E2'; // Red-50
const medicalBlue = '#1E40AF'; // Blue-700
const successGreen = '#059669'; // Emerald-600
const warningOrange = '#D97706'; // Amber-600

export const Colors = {
  light: {
    text: '#1F2937', // Gray-800
    background: '#FFFFFF',
    tint: emergencyRed,
    icon: '#6B7280', // Gray-500
    tabIconDefault: '#9CA3AF', // Gray-400
    tabIconSelected: emergencyRed,
    // Emergency theme colors
    primary: emergencyRed,
    primaryLight: emergencyRedLight,
    secondary: medicalBlue,
    success: successGreen,
    warning: warningOrange,
    surface: '#F9FAFB', // Gray-50
    surfaceVariant: '#F3F4F6', // Gray-100
    border: '#E5E7EB', // Gray-200
    textSecondary: '#6B7280', // Gray-500
    textMuted: '#9CA3AF', // Gray-400
  },
  dark: {
    text: '#F9FAFB', // Gray-50
    background: '#111827', // Gray-900
    tint: '#EF4444', // Red-500 (lighter for dark mode)
    icon: '#9CA3AF', // Gray-400
    tabIconDefault: '#6B7280', // Gray-500
    tabIconSelected: '#EF4444',
    // Emergency theme colors
    primary: '#EF4444', // Red-500
    primaryLight: '#7F1D1D', // Red-900
    secondary: '#3B82F6', // Blue-500
    success: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    surface: '#1F2937', // Gray-800
    surfaceVariant: '#374151', // Gray-700
    border: '#4B5563', // Gray-600
    textSecondary: '#9CA3AF', // Gray-400
    textMuted: '#6B7280', // Gray-500
  },
};
