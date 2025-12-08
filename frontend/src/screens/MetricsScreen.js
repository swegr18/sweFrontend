import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useSpeechStore } from '../store/speechStore';
import { speechAPI } from '../services/api';

const screenWidth = Dimensions.get('window').width;

export const MetricsScreen = ({ navigation }) => {
  const { audioUri, contextMode, realtimeFeedback, speechName, setSpeechName } = useSpeechStore();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    // In production, send audioUri to backend and get metrics
    // For now, simulate metrics
    setTimeout(() => {
      setMetrics({
        wpm: 145,
        fillerWords: 12,
        fillerPercentage: 8,
        volumeRange: 'Good',
        transcribable: 92,
        positiveFeedback: [
          'Great pacing! Your words per minute is in the ideal range.',
          'Clear pronunciation makes your speech easy to understand.',
          'Good volume variation keeps the audience engaged.',
        ],
        negativeFeedback: [
          'Try to reduce filler words like "um" and "uh".',
          'Consider adding more pauses for emphasis.',
        ],
      });
    }, 1500);
  }, []);

  const handleSave = async () => {
    if (!speechName.trim()) {
      alert('Please enter a name for your speech');
      return;
    }
    
    setLoading(true);
    try {
      // In production, save to backend
      // await speechAPI.saveSpeech(speechId, speechName);
      alert('Speech saved successfully!');
      navigation.navigate('Home');
    } catch (error) {
      alert('Failed to save speech');
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surfaceLight,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const wpmData = {
    labels: ['0s', '30s', '60s', '90s', '120s'],
    datasets: [{
      data: [120, 135, 150, 145, 148],
      color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  if (!metrics) {
    return (
      <ScreenLayout>
        <LinearGradient colors={GRADIENTS.background} style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Analyzing your speech...</Text>
            <Text style={styles.loadingSubtext}>This may take a moment</Text>
          </View>
        </LinearGradient>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <LinearGradient colors={GRADIENTS.background} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Speech Analysis</Text>
            <Text style={styles.subtitle}>Here's how you performed</Text>
          </View>

          {/* Main Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <LinearGradient
                colors={GRADIENTS.primary}
                style={styles.metricGradient}
              >
                <Text style={styles.metricValue}>{metrics.wpm}</Text>
                <Text style={styles.metricLabel}>WPM</Text>
              </LinearGradient>
            </View>
            <View style={styles.metricCard}>
              <LinearGradient
                colors={GRADIENTS.accent}
                style={styles.metricGradient}
              >
                <Text style={styles.metricValue}>{metrics.fillerPercentage}%</Text>
                <Text style={styles.metricLabel}>Filler Words</Text>
              </LinearGradient>
            </View>
            <View style={styles.metricCard}>
              <LinearGradient
                colors={GRADIENTS.success}
                style={styles.metricGradient}
              >
                <Text style={styles.metricValue}>{metrics.transcribable}%</Text>
                <Text style={styles.metricLabel}>Clarity</Text>
              </LinearGradient>
            </View>
            <View style={styles.metricCard}>
              <LinearGradient
                colors={GRADIENTS.warning}
                style={styles.metricGradient}
              >
                <Text style={styles.metricValue}>{metrics.volumeRange}</Text>
                <Text style={styles.metricLabel}>Volume</Text>
              </LinearGradient>
            </View>
          </View>

          {/* WPM Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Words Per Minute Over Time</Text>
            <LineChart
              data={wpmData}
              width={screenWidth - SPACING.xl * 2}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Positive Feedback */}
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>✅ What You Did Well</Text>
            {metrics.positiveFeedback.map((feedback, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.feedbackBullet}>•</Text>
                <Text style={styles.feedbackText}>{feedback}</Text>
              </View>
            ))}
          </View>

          {/* Negative Feedback */}
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>💡 Areas to Improve</Text>
            {metrics.negativeFeedback.map((feedback, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.feedbackBullet}>•</Text>
                <Text style={styles.feedbackText}>{feedback}</Text>
              </View>
            ))}
          </View>

          {/* Save Speech */}
          {showNameInput ? (
            <View style={styles.saveSection}>
              <Input
                label="Speech Name"
                value={speechName}
                onChangeText={setSpeechName}
                placeholder="e.g., Product Launch Presentation"
              />
              <Button
                title="Save Speech"
                onPress={handleSave}
                loading={loading}
                variant="success"
              />
            </View>
          ) : (
            <Button
              title="Save This Speech"
              onPress={() => setShowNameInput(true)}
              variant="accent"
              style={styles.saveButton}
            />
          )}

          <Button
            title="Back to Home"
            onPress={() => navigation.navigate('Home')}
            variant="primary"
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSizeXl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  loadingSubtext: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  metricCard: {
    width: (screenWidth - SPACING.xl * 2 - SPACING.md) / 2,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  metricGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  metricValue: {
    fontSize: TYPOGRAPHY.fontSizeXxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  metricLabel: {
    fontSize: TYPOGRAPHY.fontSizeSm,
    color: COLORS.white,
    opacity: 0.9,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  chartTitle: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chart: {
    borderRadius: BORDER_RADIUS.sm,
  },
  feedbackCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  feedbackTitle: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  feedbackBullet: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  feedbackText: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
    flex: 1,
  },
  saveSection: {
    marginBottom: SPACING.md,
  },
  saveButton: {
    marginBottom: SPACING.md,
  },
});
