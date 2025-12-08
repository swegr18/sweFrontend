import { AudioModule, createAudioPlayer, requestRecordingPermissionsAsync } from 'expo-audio';

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

      // Stop any existing recording
      if (this.recorder) {
         if (this.recorder.isRecording) {
            await this.recorder.stop();
         }
         this.recorder = null;
      }

      // Create new recorder instance
      // Using default presets for now, can be customized with options
      this.recorder = new AudioModule.AudioRecorder();
      
      // Prepare and start
      await this.recorder.prepareToRecordAsync({
        android: {
          outputFormat: 'mpeg_4',
          audioEncoder: 'aac',
        },
        ios: {
          outputFormat: 'mpeg4AAC',
          audioQuality: 'high',
        }
      });
      
      this.recorder.record();
      return this.recorder;
    } catch (error) {
      console.error('Failed to start recording', error);
      throw error;
    }
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
}

export default new AudioRecorderService();
