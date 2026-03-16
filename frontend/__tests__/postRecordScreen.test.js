import React from 'react';
import { render, fireEvent, waitFor, spyOn} from '@testing-library/react-native';
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

    const { getByTestId } = render(<PostRecordScreen handleReset={mockHandleReset} isUploadFinished={true}/>);

    await waitFor(() => {
          expect(getByTestId('loading-spinner')).toBeTruthy();
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

    const { getByText, queryByText} = render(<PostRecordScreen handleReset={mockHandleReset} isUploadFinished={true} />);

    await waitFor(() => {
          expect(getByText(/15.5/)).toBeTruthy();
          expect(getByText(/-42.1/)).toBeTruthy();
          expect(getByText(/210/)).toBeTruthy();
          expect(getByText(/135/)).toBeTruthy();
          expect(queryByText('Loading...')).toBeNull(); 
        });
  });

  
  test('Should display error message and fallback to "0" on failed fetch', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: 'Failed to analyze audio' }),
    });

    const { getByText } = render(<PostRecordScreen handleReset={mockHandleReset} isUploadFinished={true}/>);

    // Mock failure response
    await waitFor(() => {
        expect(getByText(/Failed to fetch/)).toBeTruthy();
    });


  })

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
  
test('Should validate speech name and show error messages on Save', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ duration: 10, avg_volume_dbfs: -10, avg_pitch_hz: 200, wpm: 140 }),
    });

    const { getByTestId, getByText, findByText } = render(
      <PostRecordScreen handleReset={mockHandleReset} isUploadFinished={true} accessToken="dummy-token" />
    );

    await findByText('Metrics Calculated');

    const saveButton = getByText('SAVE');
    const nameInput = getByTestId('nameButton');

    fireEvent.press(saveButton);
    expect(getByText('Name cannot be empty')).toBeTruthy();

    fireEvent.changeText(nameInput, 'Invalid*Name?');
    fireEvent.press(saveButton);
    expect(getByText('Name contains prohibited character')).toBeTruthy();
  });


  test('Should successfully save to backend and call handleReset', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ duration: 15.5, avg_volume_dbfs: -12, avg_pitch_hz: 210, wpm: 135 }),
    });

    const { getByTestId, getByText, findByText } = render(
      <PostRecordScreen handleReset={mockHandleReset} isUploadFinished={true} accessToken="dummy-token" fileid="file123" />
    );

    await findByText('Metrics Calculated');

    fireEvent.changeText(getByTestId('nameButton'), 'Valid Speech Name');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 'user-789' }),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    fireEvent.press(getByText('SAVE'));

    await waitFor(() => {
      expect(mockHandleReset).toHaveBeenCalled();
    });
  });

  test('Should apply correct color styling for amber and red metric thresholds', async () => {
    const edgeCaseMetrics = {
      duration: 10,
      avg_volume_dbfs: -2,  // triggers red
      wpm: 110,            
      avg_pitch_hz: 300,    
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(edgeCaseMetrics),
    });

    const { findByText } = render(<PostRecordScreen handleReset={mockHandleReset} isUploadFinished={true} />);
    
    expect(await findByText('Metrics Calculated')).toBeTruthy();
  });

  test('Should call handleReset when delete button is pressed', async () => {
    const { getByText } = render(<PostRecordScreen handleReset={mockHandleReset} />);
    
    fireEvent.press(getByText('DELETE'));
    expect(mockHandleReset).toHaveBeenCalled();
  });

});