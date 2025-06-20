export const clearLocalUserData = () => {
  const keys = [
    'spotify_access_token',
    'spotify_refresh_token',
    'spotify_user',
    'spotify_token_expires_at',
    'enhanced_spotify_sessions',
  ];
  keys.forEach((k) => localStorage.removeItem(k));
}; 