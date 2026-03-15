import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LiveWPMSwitch from '../src/components/liveWPMSwitch'; 

describe('LiveWPMSwitch Component', () => {
  
  test('Should render both buttons initially', () => {
    const { getByRole } = render(<LiveWPMSwitch />);
    
    expect(getByRole('button', { name: 'wpmOn' })).toBeTruthy();
    expect(getByRole('button', { name: 'wpmOff' })).toBeTruthy();
  });

  test('Should update state and call onLiveModeChange when "Off" is pressed (Lines 63-76)', () => {
    const mockOnModeChange = jest.fn();
    const { getByRole } = render(<LiveWPMSwitch onLiveModeChange={mockOnModeChange} />);
    
    const offButton = getByRole('button', { name: 'wpmOff' });
    
    fireEvent.press(offButton);
    
    expect(mockOnModeChange).toHaveBeenCalledWith('Off');
  });

  test('Should switch back to "On" when pressed', () => {
    const mockOnModeChange = jest.fn();
    const { getByRole } = render(<LiveWPMSwitch onLiveModeChange={mockOnModeChange} />);
    
    const offButton = getByRole('button', { name: 'wpmOff' });
    const onButton = getByRole('button', { name: 'wpmOn' });
    
    fireEvent.press(offButton);
    expect(mockOnModeChange).toHaveBeenCalledWith('Off');
    
    fireEvent.press(onButton);
    expect(mockOnModeChange).toHaveBeenCalledWith('On');
  });

  test('Should not crash if onLiveModeChange prop is missing (Lines 10-13)', () => {
    const { getByRole } = render(<LiveWPMSwitch />);
    
    const offButton = getByRole('button', { name: 'wpmOff' });
    
    expect(() => fireEvent.press(offButton)).not.toThrow();
  });

});