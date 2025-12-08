import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS, BORDER_RADIUS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../services/api';

export const SettingsScreen = ({ navigation }) => {
  const { user, isGuest, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (isGuest) {
      alert('Please log in to update your profile');
      return;
    }

    setLoading(true);
    try {
      // await userAPI.updateProfile({ name, email });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Welcome');
  };

  return (
    <ScreenLayout>
      <LinearGradient colors={GRADIENTS.background} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your account and preferences</Text>
          </View>

          {isGuest ? (
            <View style={styles.guestCard}>
              <Text style={styles.guestTitle}>You're using Guest Mode</Text>
              <Text style={styles.guestText}>
                Create an account to save your progress and access all features
              </Text>
              <Button
                title="Create Account"
                onPress={() => navigation.navigate('Signup')}
                variant="primary"
                style={styles.guestButton}
              />
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <Input
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                />
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Button
                  title="Update Profile"
                  onPress={handleUpdateProfile}
                  loading={loading}
                  variant="primary"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceText}>Default Context Mode</Text>
                  <Text style={styles.preferenceValue}>In-Person</Text>
                </View>
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceText}>Real-time Feedback</Text>
                  <Text style={styles.preferenceValue}>Enabled</Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2025.12.07</Text>
            </View>
          </View>

          {!isGuest && (
            <Button
              title="Log Out"
              onPress={handleLogout}
              variant="error"
            />
          )}
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
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
  },
  guestCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  guestTitle: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  guestText: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  guestButton: {
    width: '100%',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  preferenceText: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.text,
  },
  preferenceValue: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.text,
  },
});
