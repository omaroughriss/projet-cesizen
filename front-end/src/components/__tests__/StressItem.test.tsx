import { render, screen, fireEvent } from '@testing-library/react';
import StressItem from '../StressItem';

describe('StressItem Component', () => {
  const mockProps = {
    id: '1',
    title: 'Test Stress Item',
    description: 'Test Description',
    label: 'Test Label',
    points: 5,
    checked: false,
    onChange: jest.fn(),
    index: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Rendre StressItem', () => {
    render(<StressItem {...mockProps} />);

    expect(screen.getByText(mockProps.label)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  test('Simuler clic sélection', () => {
    render(<StressItem {...mockProps} />);
    
    const item = screen.getByRole('checkbox');
    fireEvent.click(item);

    expect(mockProps.onChange).toHaveBeenCalledWith(mockProps.id);
  });

  test('Vérifier état sélectionné', () => {
    render(<StressItem {...mockProps} checked={true} />);

    const item = screen.getByRole('checkbox');
    expect(item).toBeChecked();
  });

  test('Simuler clic désélection', () => {
    render(<StressItem {...mockProps} checked={true} />);
    
    const item = screen.getByRole('checkbox');
    fireEvent.click(item);

    expect(mockProps.onChange).toHaveBeenCalledWith(mockProps.id);
  });

  test('Vérifier état non sélectionné', () => {
    render(<StressItem {...mockProps} />);

    const item = screen.getByRole('checkbox');
    expect(item).not.toBeChecked();
  });
}); 