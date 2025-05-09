import axios from 'axios';

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  TIMEOUT: 15000,
  HEADERS: {
    DEFAULT: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
};

// Création d'une instance axios avec configuration de base
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS.DEFAULT,
});

// Variable pour suivre si nous sommes en train de vérifier l'auth
let isCheckingAuth = false;

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Non authentifié
          localStorage.removeItem('token');
          // Éviter la boucle de redirection pendant la vérification de l'auth
          if (!isCheckingAuth && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Non autorisé
          console.error('Accès non autorisé');
          break;
        case 404:
          // Ressource non trouvée
          console.error('Ressource non trouvée');
          break;
        case 422:
          // Erreur de validation
          console.error('Erreur de validation:', error.response.data);
          break;
        default:
          console.error('Erreur serveur:', error.response.data);
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      console.error('Pas de réponse du serveur');
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    return Promise.reject(error);
  }
);

export const setIsCheckingAuth = (value: boolean) => {
  isCheckingAuth = value;
};

export default api; 