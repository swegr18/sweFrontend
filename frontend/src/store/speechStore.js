import { create } from 'zustand';

export const useSpeechStore = create((set) => ({
  isRecording: false,
  contextMode: 'In-Person', // 'In-Person' or 'Online'
  realtimeFeedback: false,
  currentWPM: 0,
  audioUri: null,
  metrics: null,
  speechName: '',
  
  setRecording: (isRecording) => set({ isRecording }),
  setContextMode: (contextMode) => set({ contextMode }),
  setRealtimeFeedback: (realtimeFeedback) => set({ realtimeFeedback }),
  setCurrentWPM: (currentWPM) => set({ currentWPM }),
  setAudioUri: (audioUri) => set({ audioUri }),
  setMetrics: (metrics) => set({ metrics }),
  setSpeechName: (speechName) => set({ speechName }),
  
  resetSpeech: () => set({ 
    isRecording: false, 
    currentWPM: 0, 
    audioUri: null, 
    metrics: null,
    speechName: '',
  }),
}));
