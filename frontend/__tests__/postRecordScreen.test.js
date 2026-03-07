import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PostRecordScreen from '../src/postRecordScreen';

describe('Post Recording Screen Statistics', () => {
  const mockHandleReset = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn();
    mockHandleReset.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  
  test('Should display "Loading..." state initially', async () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(<PostRecordScreen handleReset={mockHandleReset} />);

    await waitFor(() => {
          expect(getByText(/Loading.../)).toBeTruthy();
    });
  });


  test('Should display fetched stats correctly', async () => {
    const mockMetrics = {
      duration: 15.5,
      avg_volume_dbfs: -42.1,
      avg_pitch_hz: 210,
      wpm: 135,
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockMetrics),
    });

    const { getByText, queryByText} = render(<PostRecordScreen handleReset={mockHandleReset} />);

    await waitFor(() => {
          expect(getByText(/15.5/)).toBeTruthy();
          expect(getByText(/-42.1/)).toBeTruthy();
          expect(getByText(/210/)).toBeTruthy();
          expect(getByText(/135/)).toBeTruthy();
          expect(queryByText('Loading...')).toBeNull(); 
        });
  });

  /*
  test('Should display error message and fallback to "0" on failed fetch', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: 'Failed to analyze audio' }),
    });

    const { getByText } = render(<PostRecordScreen handleReset={mockHandleReset} />);

    // Mock failure response
    await waitFor(() => {
        expect(getByText(/Failed to analyze audio/)).toBeTruthy();
    });


  })
*/
    test('Should display Naming input', async () => {
      const mockMetrics = {
      duration: 15.5,
      avg_volume_dbfs: -42.1,
      avg_pitch_hz: 210,
      wpm: 135,
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMetrics),
      });
      const { findByTestId } = render(<PostRecordScreen handleReset={mockHandleReset} />);

      const nameButton = await findByTestId('nameButton');
      expect(nameButton).toBeTruthy();
    }); 

});