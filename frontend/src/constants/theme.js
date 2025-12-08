// Premium color palette and theme configuration
export const COLORS = {
  // Primary brand colors - Deep purple gradient
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  // Accent colors - Vibrant cyan/teal
  accent: '#06B6D4',
  accentDark: '#0891B2',
  accentLight: '#22D3EE',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral colors - Dark theme optimized
  background: '#0F172A',
  backgroundLight: '#1E293B',
  surface: '#1E293B',
  surfaceLight: '#334155',
  
  // Text colors
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  // Borders and dividers
  border: '#334155',
  divider: '#475569',
  
  // Overlay
  overlay: 'rgba(15, 23, 42, 0.8)',
  overlayLight: 'rgba(30, 41, 59, 0.9)',
  
  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export const GRADIENTS = {
  primary: ['#6366F1', '#8B5CF6', '#A855F7'],
  accent: ['#06B6D4', '#14B8A6', '#10B981'],
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  error: ['#EF4444', '#DC2626'],
  background: ['#0F172A', '#1E293B'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 24,
  fontSizeXxl: 32,
  fontSizeDisplay: 48,
  
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};
