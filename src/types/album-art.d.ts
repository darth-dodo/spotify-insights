declare module 'album-art' {
  /**
   * Fetches the cover art URL for an artist / album.
   * @param artist The artist name
   * @param album  The album name (optional). If omitted, attempts to fetch artist artwork.
   * @param size   Desired size keyword (e.g., 'small', 'medium', 'large')
   * @returns A promise that resolves to a direct image URL string.
   */
  const albumArt: (artist: string, album?: string, size?: string) => Promise<string>;
  export default albumArt;
} 