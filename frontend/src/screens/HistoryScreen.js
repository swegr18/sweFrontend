import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../components/ScreenLayout';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { speechAPI } from '../services/api';

export const HistoryScreen = ({ navigation }) => {
  const [speeches, setSpeeches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      // In production, fetch from backend
      // const data = await speechAPI.getHistory();
      
      // Mock data for now
      setSpeeches([
        {
          id: 1,
          name: 'Product Launch Presentation',
          date: '2025-12-06',
          wpm: 145,
          fillerPercentage: 8,
          clarity: 92,
        },
        {
          id: 2,
          name: 'Team Meeting Speech',
          date: '2025-12-05',
          wpm: 138,
          fillerPercentage: 12,
          clarity: 88,
        },
        {
          id: 3,
          name: 'Client Pitch',
          date: '2025-12-03',
          wpm: 152,
          fillerPercentage: 6,
          clarity: 95,
        },
      ]);
    } catch (error) {
      alert('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (speech) => {
    // Navigate to detail view
    // navigation.navigate('SpeechDetail', { speech });
    alert('Detail view coming soon!');
  };

  const handleDelete = async (speechId) => {
    try {
      // await speechAPI.deleteSpeech(speechId);
      setSpeeches(speeches.filter(s => s.id !== speechId));
    } catch (error) {
      alert('Failed to delete speech');
    }
  };

  if (loading) {
    return (
      <ScreenLayout>
        <LinearGradient colors={GRADIENTS.background} style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        </LinearGradient>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <LinearGradient colors={GRADIENTS.background} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Speech History</Text>
            <Text style={styles.subtitle}>{speeches.length} speeches recorded</Text>
          </View>

          {speeches.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>No speeches yet</Text>
              <Text style={styles.emptySubtext}>
                Start recording to build your history
              </Text>
            </View>
          ) : (
            speeches.map((speech) => (
              <TouchableOpacity
                key={speech.id}
                onPress={() => handleViewDetails(speech)}
                activeOpacity={0.8}
              >
                <View style={styles.speechCard}>
                  <View style={styles.speechHeader}>
                    <Text style={styles.speechName}>{speech.name}</Text>
                    <Text style={styles.speechDate}>{speech.date}</Text>
                  </View>
                  
                  <View style={styles.metricsRow}>
                    <View style={styles.miniMetric}>
                      <Text style={styles.miniMetricValue}>{speech.wpm}</Text>
                      <Text style={styles.miniMetricLabel}>WPM</Text>
                    </View>
                    <View style={styles.miniMetric}>
                      <Text style={styles.miniMetricValue}>{speech.fillerPercentage}%</Text>
                      <Text style={styles.miniMetricLabel}>Fillers</Text>
                    </View>
                    <View style={styles.miniMetric}>
                      <Text style={styles.miniMetricValue}>{speech.clarity}%</Text>
                      <Text style={styles.miniMetricLabel}>Clarity</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    color: COLORS.text,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSizeMd,
    color: COLORS.textSecondary,
  },
  speechCard: {
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
  speechHeader: {
    marginBottom: SPACING.md,
  },
  speechName: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  speechDate: {
    fontSize: TYPOGRAPHY.fontSizeSm,
    color: COLORS.textMuted,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  miniMetric: {
    alignItems: 'center',
  },
  miniMetricValue: {
    fontSize: TYPOGRAPHY.fontSizeLg,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  miniMetricLabel: {
    fontSize: TYPOGRAPHY.fontSizeXs,
    color: COLORS.textSecondary,
  },
});
