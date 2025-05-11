import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock des hooks
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn()
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

const mockUseIsMobile = jest.requireMock('@/hooks/use-mobile').useIsMobile;
const mockUseAuth = jest.requireMock('@/contexts/AuthContext').useAuth;

describe('Navbar Component', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    mockUseIsMobile.mockReset();
    mockUseAuth.mockReset();
    localStorage.clear();
  });

  test('Rendre Navbar avec rôle Admin', () => {
    // Setup
    mockUseIsMobile.mockReturnValue(false);
    mockUseAuth.mockReturnValue({ user: { role: 'administrateur' } });
    localStorage.setItem('userRole', 'administrateur');

    // Rendu
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Verifier les liens admin
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();
    expect(screen.getByText('Diagnostic')).toBeInTheDocument();
  });

  test('Vérifier liens Admin', () => {
    // Setup
    mockUseIsMobile.mockReturnValue(false);
    mockUseAuth.mockReturnValue({ user: { role: 'administrateur' } });
    localStorage.setItem('userRole', 'administrateur');

    // Rendu
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Verifier que tous les liens admin sont présents
    const adminLinks = ['Accueil', 'Diagnostic', 'Articles', 'Administration', 'Profil'];
    adminLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  test('Rendre Navbar avec rôle Utilisateur', () => {
    // Setup
    mockUseIsMobile.mockReturnValue(false);
    mockUseAuth.mockReturnValue({ user: { role: 'utilisateur' } });
    localStorage.setItem('userRole', 'utilisateur');

    // Rendu
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Verifier les liens utilisateur
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.queryByText('Administration')).not.toBeInTheDocument();
  });

  test('Vérifier liens Utilisateur', () => {
    // Setup
    mockUseIsMobile.mockReturnValue(false);
    mockUseAuth.mockReturnValue({ user: { role: 'utilisateur' } });
    localStorage.setItem('userRole', 'utilisateur');

    // Rendu
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Verifier que les liens utilisateur sont présents et les liens admin ne sont pas présents
    const userLinks = ['Accueil', 'Diagnostic', 'Articles', 'Profil'];
    const adminLinks = ['Administration'];

    userLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });

    adminLinks.forEach(link => {
      expect(screen.queryByText(link)).not.toBeInTheDocument();
    });
  });
}); 