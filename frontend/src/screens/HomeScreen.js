import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

export const HomeScreen = ({ navigation }) => {
  const { user, isGuest } = useAuthStore();

  const handleStartSpeech = () => {
    navigation.navigate('Recording');
  };

  const handleViewHistory = () => {
    if (isGuest) {
      alert('Please log in to view your speech history');
      return;
    }
    navigation.navigate('History');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScreenLayout>
      <LinearGradient colors={GRADIENTS.background} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}! 👋</Text>
            <Text style={styles.tagline}>Ready to practice your speaking skills?</Text>
          </View>

          {/* Main Action Card */}
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={handleStartSpeech}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainCard}
            >
              <Ionicons name="mic" size={60} color={COLORS.white} style={styles.mainCardIcon} />
              <Text style={styles.mainCardTitle}>Start a New Speech</Text>
              <Text style={styles.mainCardSubtitle}>
                Practice your presentation and get instant AI feedback
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Feature Cards */}
          <View style={styles.featuresGrid}>
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={handleViewHistory}
            >
              <LinearGradient
                colors={[COLORS.surface, COLORS.surfaceLight]}
                style={styles.featureCardGradient}
              >
                <Ionicons name="stats-chart" size={40} color={COLORS.primary} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>History</Text>
                <Text style={styles.featureSubtitle}>
                  {isGuest ? 'Login to view' : 'View past speeches'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.featureCard}
              onPress={handleSettings}
            >
              <LinearGradient
                colors={[COLORS.surface, COLORS.surfaceLight]}
                style={styles.featureCardGradient}
              >
                <Ionicons name="settings-sharp" size={40} color={COLORS.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureTitle}>Settings</Text>
                <Text style={styles.featureSubtitle}>
                  Customize your experience
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>What you'll get:</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Real-time words-per-minute tracking</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Filler word detection and analysis</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Volume and clarity metrics</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Personalized improvement feedback</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl + 20, // Add extra padding at bottom
  },
  header: {
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSizeXxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
  },
  mainCard: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  mainCardIcon: {
    // fontSize: 60, // Removed font size as it applies to Text, Icon uses size prop
    marginBottom: SPACING.md,
  },
  mainCardTitle: {
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  mainCardSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  featureCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  featureCardGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
    height: 160, // Fixed height to ensure consistency
    justifyContent: 'center',
  },
  featureIcon: {
    // fontSize: 40, // Removed
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  featureSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeXs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoBullet: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.success,
    marginRight: SPACING.sm,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
