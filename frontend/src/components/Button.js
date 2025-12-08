import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  style 
}) => {
  const getGradient = () => {
    switch (variant) {
      case 'accent': return GRADIENTS.accent;
      case 'success': return GRADIENTS.success;
      case 'error': return GRADIENTS.error;
      default: return GRADIENTS.primary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md };
      case 'lg': return { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl };
      default: return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg };
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[styles.buttonContainer, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? [COLORS.surfaceLight, COLORS.surface] : getGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, getSize()]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
});
