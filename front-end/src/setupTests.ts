import '@testing-library/jest-dom';
import 'jest-environment-jsdom';

// Mock des hooks de routage
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/'
  }),
  useNavigate: () => jest.fn()
}));

// Mock du hook d'authentification
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null
  })
}));

// Mock du hook mobile
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
})); 