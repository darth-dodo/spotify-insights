
export const dummySpotifyUser = {
  id: 'dummy_user_123',
  display_name: 'John Doe',
  email: 'john.doe@example.com',
  images: [
    {
      url: 'https://picsum.photos/300/300',
      height: 300,
      width: 300
    }
  ],
  country: 'US',
  followers: {
    total: 1234
  },
  product: 'premium'
};

export const dummyTopTracks = {
  items: [
    {
      id: 'track1',
      name: 'Bohemian Rhapsody',
      artists: [{ id: 'queen', name: 'Queen' }],
      album: {
        id: 'album1',
        name: 'A Night at the Opera',
        images: [{ url: 'https://picsum.photos/300/300?random=1', height: 300, width: 300 }]
      },
      duration_ms: 355000,
      popularity: 95,
      preview_url: null
    },
    {
      id: 'track2',
      name: 'Stairway to Heaven',
      artists: [{ id: 'led-zeppelin', name: 'Led Zeppelin' }],
      album: {
        id: 'album2',
        name: 'Led Zeppelin IV',
        images: [{ url: 'https://picsum.photos/300/300?random=2', height: 300, width: 300 }]
      },
      duration_ms: 482000,
      popularity: 92,
      preview_url: null
    },
    {
      id: 'track3',
      name: 'Hotel California',
      artists: [{ id: 'eagles', name: 'Eagles' }],
      album: {
        id: 'album3',
        name: 'Hotel California',
        images: [{ url: 'https://picsum.photos/300/300?random=3', height: 300, width: 300 }]
      },
      duration_ms: 391000,
      popularity: 89,
      preview_url: null
    }
  ]
};

export const dummyTopArtists = {
  items: [
    {
      id: 'queen',
      name: 'Queen',
      genres: ['rock', 'classic rock', 'british rock'],
      images: [{ url: 'https://picsum.photos/300/300?random=4', height: 300, width: 300 }],
      popularity: 95,
      followers: { total: 45000000 }
    },
    {
      id: 'led-zeppelin',
      name: 'Led Zeppelin',
      genres: ['rock', 'hard rock', 'classic rock'],
      images: [{ url: 'https://picsum.photos/300/300?random=5', height: 300, width: 300 }],
      popularity: 92,
      followers: { total: 12000000 }
    },
    {
      id: 'eagles',
      name: 'Eagles',
      genres: ['rock', 'classic rock', 'country rock'],
      images: [{ url: 'https://picsum.photos/300/300?random=6', height: 300, width: 300 }],
      popularity: 89,
      followers: { total: 8500000 }
    }
  ]
};

export const dummyRecentlyPlayed = {
  items: [
    {
      track: dummyTopTracks.items[0],
      played_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      context: null
    },
    {
      track: dummyTopTracks.items[1],
      played_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      context: null
    },
    {
      track: dummyTopTracks.items[2],
      played_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      context: null
    }
  ]
};

export const dummyCurrentPlayback = {
  is_playing: true,
  item: dummyTopTracks.items[0],
  progress_ms: 120000,
  device: {
    id: 'device1',
    name: 'MacBook Pro',
    type: 'Computer',
    volume_percent: 75
  }
};
