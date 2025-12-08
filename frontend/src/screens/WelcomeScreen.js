import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

export const WelcomeScreen = ({ navigation }) => {
  const { guestMode } = useAuthStore();

  const handleGuestMode = () => {
    guestMode();
    navigation.replace('Home');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <ScreenLayout>
      <LinearGradient
        colors={GRADIENTS.background}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo/Icon Area */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={GRADIENTS.primary}
              style={styles.logoGradient}
            >
              <Text style={styles.logoText}>🎤</Text>
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>SpeechMentor</Text>
          <Text style={styles.subtitle}>
            Master your public speaking with AI-powered feedback
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Continue as Guest"
              onPress={handleGuestMode}
              variant="accent"
              style={styles.button}
            />
            <Button
              title="Log In"
              onPress={handleLogin}
              variant="primary"
              style={styles.button}
            />
            <Button
              title="Sign Up"
              onPress={handleSignup}
              variant="primary"
              style={styles.button}
            />
          </View>

          {/* Footer text */}
          <Text style={styles.footerText}>
            Start your journey to confident speaking today
          </Text>
        </View>
      </LinearGradient>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 60,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeDisplay,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSizeSm,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
    textAlign: 'center',
  },
});
