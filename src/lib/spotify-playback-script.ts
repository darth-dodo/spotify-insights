
export class SpotifyScriptLoader {
  private static sdkLoadPromise: Promise<void> | null = null;

  static loadSDKScript(): Promise<void> {
    // Return existing promise if already loading
    if (this.sdkLoadPromise) {
      return this.sdkLoadPromise;
    }

    this.sdkLoadPromise = new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="sdk.scdn.co"]');
      if (existingScript) {
        console.log('SDK script already exists');
        // If SDK is already loaded, resolve immediately
        if (window.Spotify?.Player) {
          resolve();
        } else {
          // Wait for the existing script to load
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error('Failed to load existing Spotify SDK script')));
        }
        return;
      }

      console.log('Loading Spotify SDK script...');
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      
      const timeout = setTimeout(() => {
        reject(new Error('Spotify SDK script load timeout'));
      }, 10000); // 10 second timeout

      script.onload = () => {
        clearTimeout(timeout);
        console.log('Spotify SDK script loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load Spotify Web Playback SDK'));
      };
      
      document.head.appendChild(script);
    });

    return this.sdkLoadPromise;
  }

  static removeSDKScript(): void {
    const existingScript = document.querySelector('script[src*="sdk.scdn.co"]');
    if (existingScript) {
      existingScript.remove();
      console.log('Removed Spotify SDK script');
    }
    this.sdkLoadPromise = null;
  }
}
