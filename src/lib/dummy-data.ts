
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
      name: 'Paranoid',
      artists: [{ id: 'black-sabbath', name: 'Black Sabbath' }],
      album: {
        id: 'album1',
        name: 'Paranoid',
        images: [{ url: 'https://picsum.photos/300/300?random=1', height: 300, width: 300 }]
      },
      duration_ms: 170000,
      popularity: 95,
      preview_url: null
    },
    {
      id: 'track2',
      name: 'The Number of the Beast',
      artists: [{ id: 'iron-maiden', name: 'Iron Maiden' }],
      album: {
        id: 'album2',
        name: 'The Number of the Beast',
        images: [{ url: 'https://picsum.photos/300/300?random=2', height: 300, width: 300 }]
      },
      duration_ms: 293000,
      popularity: 92,
      preview_url: null
    },
    {
      id: 'track3',
      name: 'Breaking the Law',
      artists: [{ id: 'judas-priest', name: 'Judas Priest' }],
      album: {
        id: 'album3',
        name: 'British Steel',
        images: [{ url: 'https://picsum.photos/300/300?random=3', height: 300, width: 300 }]
      },
      duration_ms: 156000,
      popularity: 89,
      preview_url: null
    }
  ]
};

export const dummyTopArtists = {
  items: [
    {
      id: 'black-sabbath',
      name: 'Black Sabbath',
      genres: ['old school metal', 'heavy metal', 'doom metal'],
      images: [{ url: 'https://picsum.photos/300/300?random=4', height: 300, width: 300 }],
      popularity: 95,
      followers: { total: 8500000 }
    },
    {
      id: 'iron-maiden',
      name: 'Iron Maiden',
      genres: ['old school metal', 'heavy metal', 'nwobhm'],
      images: [{ url: 'https://picsum.photos/300/300?random=5', height: 300, width: 300 }],
      popularity: 92,
      followers: { total: 15000000 }
    },
    {
      id: 'judas-priest',
      name: 'Judas Priest',
      genres: ['old school metal', 'heavy metal', 'speed metal'],
      images: [{ url: 'https://picsum.photos/300/300?random=6', height: 300, width: 300 }],
      popularity: 89,
      followers: { total: 7200000 }
    },
    {
      id: 'deep-purple',
      name: 'Deep Purple',
      genres: ['old school metal', 'hard rock', 'progressive rock'],
      images: [{ url: 'https://picsum.photos/300/300?random=7', height: 300, width: 300 }],
      popularity: 87,
      followers: { total: 6800000 }
    },
    {
      id: 'motorhead',
      name: 'Motörhead',
      genres: ['old school metal', 'speed metal', 'hard rock'],
      images: [{ url: 'https://picsum.photos/300/300?random=8', height: 300, width: 300 }],
      popularity: 85,
      followers: { total: 5400000 }
    },
    {
      id: 'led-zeppelin',
      name: 'Led Zeppelin',
      genres: ['old school metal', 'hard rock', 'classic rock'],
      images: [{ url: 'https://picsum.photos/300/300?random=9', height: 300, width: 300 }],
      popularity: 93,
      followers: { total: 12000000 }
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
      played_at: new Date(Date.now() - 1000 * 90).toISOString(), // 1.5 hours ago
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
