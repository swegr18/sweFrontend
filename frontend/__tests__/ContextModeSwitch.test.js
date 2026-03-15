import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContextModeSwitch from '../src/components/contextModeSwitch';

describe('ContextModeSwitch Component', () => {
  
  test('Should render both buttons initially', () => {
    const { getByRole } = render(<ContextModeSwitch />);
    
    expect(getByRole('button', { name: 'In-Person' })).toBeTruthy();
    expect(getByRole('button', { name: 'Online' })).toBeTruthy();
  });

  test('Should update state and call onModeChange when "Online" is pressed (Lines 63-76)', () => {
    const mockOnModeChange = jest.fn();
    const { getByRole } = render(<ContextModeSwitch onModeChange={mockOnModeChange} />);
    
    const onlineButton = getByRole('button', { name: 'Online' });
    
    fireEvent.press(onlineButton);
    
    expect(mockOnModeChange).toHaveBeenCalledWith('Online');
  });

  test('Should switch back to "In-Person" when pressed', () => {
    const mockOnModeChange = jest.fn();
    const { getByRole } = render(<ContextModeSwitch onModeChange={mockOnModeChange} />);
    
    const onlineButton = getByRole('button', { name: 'Online' });
    const inPersonButton = getByRole('button', { name: 'In-Person' });
    
    fireEvent.press(onlineButton);
    expect(mockOnModeChange).toHaveBeenCalledWith('Online');
    
    fireEvent.press(inPersonButton);
    expect(mockOnModeChange).toHaveBeenCalledWith('In-Person');
  });

  test('Should not crash if onModeChange prop is missing (Lines 49-52)', () => {
    const { getByRole } = render(<ContextModeSwitch />);
    
    const onlineButton = getByRole('button', { name: 'Online' });
    
    expect(() => fireEvent.press(onlineButton)).not.toThrow();
  });

});