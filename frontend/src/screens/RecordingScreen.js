import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../components/ScreenLayout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useSpeechStore } from '../store/speechStore';
import audioRecorder from '../services/audioRecorder';

export const RecordingScreen = ({ navigation }) => {
  const {
    isRecording,
    contextMode,
    realtimeFeedback,
    currentWPM,
    setRecording,
    setContextMode,
    setRealtimeFeedback,
    setCurrentWPM,
    setAudioUri,
  } = useSpeechStore();

  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      // Poll for audio metering every 100ms
      const meteringInterval = setInterval(() => {
        const db = audioRecorder.getMeteringLevel();
        if (db > -160) {
           // Map dB (-60 to 0) to scale (1 to 1.5)
           const normalized = Math.max(0, (db + 60) / 60);
           const scale = 1 + (normalized * 0.5);

           Animated.timing(pulseAnim, {
             toValue: scale,
             duration: 100,
             useNativeDriver: true,
           }).start();
        }
      }, 100);

      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        // Simulate real-time WPM (in production, this would come from backend)
        if (realtimeFeedback) {
          setCurrentWPM(Math.floor(Math.random() * 40) + 120); // 120-160 WPM
        }
      }, 1000);
      setTimerInterval(interval);

      return () => {
        clearInterval(meteringInterval);
        if (interval) clearInterval(interval);
      };
    } else {
      // Stop animation and timer
      pulseAnim.setValue(1);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  }, [isRecording, realtimeFeedback]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      await audioRecorder.startRecording();
      setRecording(true);
      setRecordingTime(0);
    } catch (error) {
      alert('Failed to start recording: ' + error.message);
    }
  };

  const handleStopRecording = async () => {
    try {
      const uri = await audioRecorder.stopRecording();
      setRecording(false);
      setAudioUri(uri);
      
      // Navigate to metrics screen
      navigation.navigate('Metrics');
    } catch (error) {
      alert('Failed to stop recording: ' + error.message);
    }
  };

  return (
    <ScreenLayout>
      <LinearGradient colors={GRADIENTS.background} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Ready to Practice</Text>
            <Text style={styles.subtitle}>Configure your session below</Text>
          </View>

          {/* Context Mode Selector */}
          <View style={styles.settingCard}>
            <Text style={styles.settingLabel}>Context Mode</Text>
            <View style={styles.contextToggle}>
              <TouchableOpacity
                style={[
                  styles.contextButton,
                  contextMode === 'In-Person' && styles.contextButtonActive,
                ]}
                onPress={() => setContextMode('In-Person')}
              >
                <Text style={[
                  styles.contextButtonText,
                  contextMode === 'In-Person' && styles.contextButtonTextActive,
                ]}>
                  🧑‍🤝‍🧑 In-Person
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.contextButton,
                  contextMode === 'Online' && styles.contextButtonActive,
                ]}
                onPress={() => setContextMode('Online')}
              >
                <Text style={[
                  styles.contextButtonText,
                  contextMode === 'Online' && styles.contextButtonTextActive,
                ]}>
                  💻 Online
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Real-time Feedback Toggle */}
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Real-Time Feedback</Text>
                <Text style={styles.settingDescription}>
                  See WPM while recording
                </Text>
              </View>
              <Switch
                value={realtimeFeedback}
                onValueChange={setRealtimeFeedback}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={realtimeFeedback ? COLORS.white : COLORS.textMuted}
              />
            </View>
          </View>

          {/* Recording Indicator */}
          <View style={styles.recordingSection}>
            {isRecording ? (
              <>
                <Animated.View style={[styles.recordingIndicator, { transform: [{ scale: pulseAnim }] }]}>
                  <LinearGradient
                    colors={GRADIENTS.error}
                    style={styles.recordingDot}
                  />
                </Animated.View>
                <Text style={styles.recordingText}>RECORDING</Text>
                <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
                
                {realtimeFeedback && currentWPM > 0 && (
                  <View style={styles.wpmContainer}>
                    <Text style={styles.wpmLabel}>Current WPM</Text>
                    <Text style={styles.wpmValue}>{currentWPM}</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.micContainer}>
                  <Text style={styles.micIcon}>🎤</Text>
                </View>
                <Text style={styles.readyText}>Tap to Start Recording</Text>
              </>
            )}
          </View>

          {/* Control Buttons */}
          <View style={styles.controls}>
            {!isRecording ? (
              <Button
                title="Start Recording"
                onPress={handleStartRecording}
                variant="primary"
                size="lg"
              />
            ) : (
              <Button
                title="Stop & Analyze"
                onPress={handleStopRecording}
                variant="error"
                size="lg"
              />
            )}
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
  settingCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.fontSizeSm,
    color: COLORS.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  contextToggle: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  contextButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  contextButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  contextButtonText: {
    fontSize: TYPOGRAPHY.fontSizeSm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  contextButtonTextActive: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  recordingSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    marginVertical: SPACING.xl,
  },
  recordingIndicator: {
    marginBottom: SPACING.md,
  },
  recordingDot: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  recordingText: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  timer: {
    fontSize: TYPOGRAPHY.fontSizeDisplay,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
  },
  wpmContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  wpmLabel: {
    fontSize: TYPOGRAPHY.fontSizeSm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  wpmValue: {
    fontSize: TYPOGRAPHY.fontSizeXxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
  },
  micContainer: {
    marginBottom: SPACING.md,
  },
  micIcon: {
    fontSize: 80,
  },
  readyText: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    color: COLORS.textSecondary,
  },
  controls: {
    marginTop: SPACING.lg,
  },
});
