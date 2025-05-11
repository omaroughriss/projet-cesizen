import { renderHook } from '@testing-library/react';
import { useToast } from '../use-toast';

describe('useToast Hook', () => {
  test('Appeler la fonction toast', () => {
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message'
    });

    expect(result.current.toasts[0]).toBeTruthy();
    expect(result.current.toasts[0].title).toBe('Test Title');
    expect(result.current.toasts[0].description).toBe('Test message');
  });

  test('Vérifier qu\'un toast apparaît', () => {
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message',
      variant: 'default'
    });

    expect(result.current.toasts[0]).toBeTruthy();
    expect(result.current.toasts[0].title).toBe('Test Title');
    expect(result.current.toasts[0].variant).toBe('default');
  });

  test('Vérifier la suppression du toast', () => {
    const { result } = renderHook(() => useToast());

    const toast = result.current.toast({
      title: 'Test Title',
      description: 'Test message'
    });

    result.current.dismiss(toast.id);
    expect(result.current.toasts).toHaveLength(0);
  });

  test('Vérifier la mise à jour du toast', () => {
    const { result } = renderHook(() => useToast());

    const toast = result.current.toast({
      title: 'Test Title',
      description: 'Test message'
    });

    toast.update({
      id: toast.id,
      title: 'Updated Title',
      description: 'Updated message'
    });

    const updatedToast = result.current.toasts.find(t => t.id === toast.id);
    expect(updatedToast?.title).toBe('Updated Title');
    expect(updatedToast?.description).toBe('Updated message');
  });

  test('Vérifier le type de toast', () => {
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message',
      variant: 'destructive'
    });

    expect(result.current.toasts[0]).toBeTruthy();
    expect(result.current.toasts[0].variant).toBe('destructive');
  });

  test('Vérifier la durée du toast', () => {
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message',
      duration: 5000
    });

    expect(result.current.toasts[0]).toBeTruthy();
    expect(result.current.toasts[0].duration).toBe(5000);
  });

  test('Vérifier retour true', () => {
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message',
      variant: 'default'
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  test('Simuler largeur écran mobile', () => {
    window.innerWidth = 375;
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message'
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  test('Simuler largeur écran desktop', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message'
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  test('Vérifier la présence du toast', () => {
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Test Title',
      description: 'Test message',
      variant: 'default'
    });

    expect(result.current.toasts).toHaveLength(1);
  });
}); 