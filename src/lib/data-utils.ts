
// Simple hash function for client-side data protection
export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate a shorter hash for display purposes
export const generateShortHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Sanitize user data to minimum required fields
export const sanitizeUserData = (userData: any) => {
  return {
    id: generateShortHash(userData.id || ''),
    display_name: userData.display_name?.substring(0, 20) || 'User',
    // Only store if user has public profile image
    has_image: Boolean(userData.images && userData.images.length > 0),
    country: userData.country?.substring(0, 2) || 'US'
  };
};
