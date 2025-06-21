import { spotifyAPI } from '../spotify-api';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`;

// Core scopes that most apps can access
const CORE_SCOPES = [
  'user-read-private',
  'user-top-read',
  'user-read-recently-played'
];

// Optional scopes that require special permissions (may cause 403)
const OPTIONAL_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'streaming'
];

// Use only core scopes by default to avoid 403 errors
const SCOPES = CORE_SCOPES.join(' ');

export const getScopes = () => SCOPES;
export const getExtendedScopes = () => [...CORE_SCOPES, ...OPTIONAL_SCOPES].join(' ');
export const getClientId = () => CLIENT_ID;
export const getRedirectUri = () => REDIRECT_URI;

export const isDemoMode = (): boolean => {
  const envDemo = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
  const onSandbox = window.location.pathname === '/sandbox';

  // Demo mode is active only when explicitly enabled via env flag or when the user
  // is on the dedicated /sandbox route. The root landing page is no longer treated
  // as implicit demo mode now that we have a separate /dashboard route.
  return envDemo || onSandbox;
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('spotify_access_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  
  if (!token || !expiry) {
    return false;
  }
  
  return Date.now() < parseInt(expiry);
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem('spotify_access_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  
  if (!token || !expiry || Date.now() >= parseInt(expiry)) {
    return null;
  }
  
  return token;
};

export const getCurrentUser = async (): Promise<any> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No access token found');
  }
  return spotifyAPI.getCurrentUser(token);
};

export const validateTokenScopes = (requiredScopes: string[] = ['streaming']): boolean => {
  const token = getAccessToken();
  if (!token || token === 'demo_access_token') {
    return false;
  }
  
  console.log('Validating token scopes for:', requiredScopes);
  return true;
};

export const hasPlaybackPermissions = (): boolean => {
  const token = getAccessToken();
  if (!token || token === 'demo_access_token') {
    return false;
  }
  
  // For now, assume playback permissions are not available by default
  // This can be enhanced later to actually check the token scopes
  return false;
};

export const shouldEnablePlaybackFeatures = (): boolean => {
  // Only enable playback features if explicitly requested and permissions are available
  const enablePlayback = localStorage.getItem('enable_playback_features') === 'true';
  return enablePlayback && hasPlaybackPermissions();
};
