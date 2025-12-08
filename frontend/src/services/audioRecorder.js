import { AudioModule, createAudioPlayer, requestRecordingPermissionsAsync, RecordingPresets } from 'expo-audio';

export class AudioRecorderService {
  constructor() {
    this.recorder = null;
    this.player = null;
    this.recordingUri = null;
  }

  async requestPermissions() {
    try {
      const status = await requestRecordingPermissionsAsync();
      return status.granted;
    } catch (error) {
      console.error('Failed to get permission', error);
      return false;
    }
  }

  async startRecording() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Audio recording permission denied');
      }

      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Stop any existing recording
      if (this.recorder) {
         if (this.recorder.isRecording) {
            await this.recorder.stop();
         }
         this.recorder = null;
      }

      // Create new recorder instance
      // Enable metering for visualizer
      const options = {
        ...RecordingPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      };
      
      this.recorder = new AudioModule.AudioRecorder(options);
      
      // Prepare and start
      await this.recorder.prepareToRecordAsync(options);
      
      this.recorder.record();
      return this.recorder;
    } catch (error) {
      console.error('Failed to start recording', error);
      throw error;
    }
  }

  addStatusListener(listener) {
    if (!this.recorder) return null;
    return this.recorder.addListener('recordingStatusUpdate', listener);
  }

  getMeteringLevel() {
    if (!this.recorder) return -160;
    const status = this.recorder.getStatus();
    return status.metering ?? -160;
  }

  async stopRecording() {
    if (!this.recorder) {
      return null;
    }

    try {
      await this.recorder.stop();
      this.recordingUri = this.recorder.uri;
      // We keep the recorder instance if we want to play it back via some other means or just return URI
      return this.recordingUri;
    } catch (error) {
      console.error('Failed to stop recording', error);
      throw error;
    }
  }

  async getStatus() {
    if (!this.recorder) {
      return null;
    }
    return {
        isRecording: this.recorder.isRecording,
        duration: this.recorder.currentTime 
    };
  }

  async playAudio(uri) {
    try {
      if (this.player) {
         this.player.pause();
         this.player = null;
      }

      this.player = createAudioPlayer(uri);
      this.player.play();
      return this.player;
    } catch (error) {
      console.error('Failed to play audio', error);
      throw error;
    }
  }

  async cleanup() {
    if (this.recorder) {
      if(this.recorder.isRecording) await this.recorder.stop();
      this.recorder = null;
    }
    if (this.player) {
      this.player.pause();
      this.player = null;
    }
  }
  async analyzeAudio(uri) {
    // Simulate API call to backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
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
      }, 2000);
    });
  }
}

export default new AudioRecorderService();
