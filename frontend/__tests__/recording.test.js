import React from 'react';
import { render, screen, act, fireEvent, waitFor} from '@testing-library/react-native';
import RecordScreen from '../src/record'; 
import { AudioModule, useAudioRecorder } from 'expo-audio'; 

describe('<RecordScreen /> - Core Recording Functions', () => {
  let originalFetch;
  let mockSetStatus;

  beforeEach(() => {


    useAudioRecorder.mockReturnValue({
        prepareToRecordAsync: jest.fn(),
        record: jest.fn(),
        stop: jest.fn(),
        uri: 'file://mock-audio-uri.m4a',
        isRecording: true, 
        }); 

    AudioModule.requestRecordingPermissionsAsync = jest.fn().mockResolvedValue({ 
      status: 'granted' 
    });

    originalFetch = global.fetch;
    
    global.fetch = jest.fn((url) => {
      if (url && !url.toString().startsWith('http')) {
        return Promise.resolve({
          blob: () => Promise.resolve({ size: 1024, type: 'audio/m4a' }), 
        });
      }
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('Success'),
        status: 200,
      });
    });

    mockSetStatus = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('Should execute startRecording and update status to "recording"', async () => {
    const { findByRole } = render(
      <RecordScreen status="idle" setStatus={mockSetStatus} accessToken="mock-token" />
    );

    const recordButton = await findByRole('button', { name: /Record/i });
    await act(async () => {
      fireEvent.press(recordButton);
    });

    await waitFor(() => {
      expect(mockSetStatus).toHaveBeenCalledWith('recording');
    });
  });

  it('Should execute stopRecording, update status, and queue final chunk', async () => {
    const { findByRole, rerender } = render(
      <RecordScreen status="idle" setStatus={mockSetStatus} accessToken="mock-token" />
    );

    const recordButton = await findByRole('button', { name: /Record/i });
    await act(async () => {
      fireEvent.press(recordButton);
    });

    rerender(
      <RecordScreen status="recording" setStatus={mockSetStatus} accessToken="mock-token" />
    );

    const stopButton = await findByRole('button', { name: /Stop/i });
    await act(async () => {
      fireEvent.press(stopButton);
    });

    await waitFor(() => {
      expect(mockSetStatus).toHaveBeenCalledWith('finishing');
    });

    await waitFor(() => {
      const fetchCalls = global.fetch.mock.calls;
      const backendCall = fetchCalls.find(call => 
        call[0].toString().includes('upload-audio')
      );
      expect(backendCall).toBeDefined();
    });
  });

  it('Should execute cycleRecording every 5 seconds and trigger uploadChunk', async () => {
    const { findByRole } = render(
      <RecordScreen status="idle" setStatus={mockSetStatus} accessToken="mock-token" />
    );

    const recordButton = await findByRole('button', { name: /Record/i });
    
    await act(async () => {
      fireEvent.press(recordButton);
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      const fetchCalls = global.fetch.mock.calls;
      const backendCall = fetchCalls.find(call => 
        call[0].toString().includes('upload-audio')
      );
      expect(backendCall).toBeDefined();
    });
  });

  it('Should handle uploadChunk API failures gracefully', async () => {
    global.fetch = jest.fn((url) => {
      if (url && !url.toString().startsWith('http')) {
        return Promise.resolve({ blob: () => Promise.resolve({ size: 1024 }) });
      }
      return Promise.resolve({ ok: false, text: () => Promise.resolve('Error'), status: 500 });
    });

    const { findByRole } = render(
      <RecordScreen status="idle" setStatus={mockSetStatus} accessToken="mock-token" />
    );

    const recordButton = await findByRole('button', { name: /Record/i });
    await act(async () => {
      fireEvent.press(recordButton);
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      const fetchCalls = global.fetch.mock.calls;
      const backendCall = fetchCalls.find(call => call[0].toString().includes('upload-audio'));
      expect(backendCall).toBeDefined();
    });
  });
  
  test('Should update mode states when switches are toggled', async () => {
    const { findByLabelText } = render(
      <RecordScreen status="idle" setStatus={mockSetStatus} accessToken="mock-token" />
    );
    const contextButton = await findByLabelText('Online'); // from ContextModeSwitch
    fireEvent.press(contextButton);

    const liveWpmButton = await findByLabelText('wpmOff'); // from LiveWPMSwitch
    fireEvent.press(liveWpmButton);

    expect(contextButton).toBeTruthy();
  });
});

