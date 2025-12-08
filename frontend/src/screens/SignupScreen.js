import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';

export const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, setLoading, loading } = useAuthStore();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!email.includes('@')) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  return (
    <ScreenLayout>
      <LinearGradient colors={GRADIENTS.background} style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us to improve your speaking skills</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                error={errors.name}
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.confirmPassword}
              />
              
              {errors.general && (
                <Text style={styles.errorText}>{errors.general}</Text>
              )}

              <Button
                title="Sign Up"
                onPress={handleSignup}
                loading={loading}
                style={styles.signupButton}
              />

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkBold}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeSm,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: SPACING.md,
  },
  linkText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSm,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
});
