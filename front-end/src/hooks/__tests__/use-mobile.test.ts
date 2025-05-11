import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';
import { act } from '@testing-library/react';

describe('useIsMobile Hook', () => {
  const originalInnerWidth = window.innerWidth;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    // Restaurer les valeurs originales
    window.innerWidth = originalInnerWidth;
    window.matchMedia = originalMatchMedia;
  });

  test('Simuler largeur écran mobile', () => {
    // Mock largeur écran mobile
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  test('Simuler largeur écran desktop', () => {
    // Mock largeur écran desktop
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(min-width: 769px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  test('Vérifier changement de taille écran', () => {
    let mediaQueryCallback: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null = null;
    
    // Initialisation comme écran desktop
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: (event: string, callback: any) => {
        mediaQueryCallback = callback;
      },
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simuler le redimensionnement vers l'écran mobile
    act(() => {
      if (mediaQueryCallback) {
        mediaQueryCallback.call(
          { matches: true } as MediaQueryList,
          { matches: true } as MediaQueryListEvent
        );
      }
    });

    expect(result.current).toBe(true);
  });
}); 