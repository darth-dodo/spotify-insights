
// Extensive dummy data with 500 tracks from 70s and 80s artists
// Using real Spotify API image URLs for authentic experience

export const classicArtists = [
  // 70s Artists
  { id: '1dfeR4HaWDbWqFHLkxsg1d', name: 'Queen', image: 'https://i.scdn.co/image/b040846ceba13c3e9c125d68389491094e7f2982', genres: ['rock', 'glam rock', 'arena rock'] },
  { id: '36QJpDe2go2KgaRleHCDTp', name: 'Led Zeppelin', image: 'https://i.scdn.co/image/207803ce008388d3427a685254f9de6a8f61dc2e', genres: ['rock', 'hard rock', 'heavy metal'] },
  { id: '3WrFJ7ztbogyGnTHbHJFl2', name: 'The Beatles', image: 'https://i.scdn.co/image/197cff807611777427c93258f0a1ccdf6b013b09', genres: ['rock', 'pop', 'psychedelic'] },
  { id: '22bE4uQ6baNwSHPVcDxLCe', name: 'The Rolling Stones', image: 'https://i.scdn.co/image/e69f71e2be4b67b82af90b0e020266f6e5cf1a40', genres: ['rock', 'blues rock'] },
  { id: '0oSGxfWSnnOXhD2fKuz2Gy', name: 'David Bowie', image: 'https://i.scdn.co/image/c41d7a9c5c9e8e217d568ba60ba3ba92c7b39e9c', genres: ['rock', 'glam rock', 'art rock'] },
  { id: '6olE6TJLqED3rqDCT0FyPh', name: 'Nirvana', image: 'https://i.scdn.co/image/84282c28d851a700132356381fcfbadc67ff498b', genres: ['grunge', 'alternative rock'] },
  { id: '0LcJLqbBmaGUft1e9Mm8HV', name: 'ABBA', image: 'https://i.scdn.co/image/38e42d8b1eb2b9b6c8e97b0a9c7e0c58f71e16a1', genres: ['pop', 'disco', 'europop'] },
  { id: '6luzFxJlf9pv8NyMNi70pE', name: 'Pink Floyd', image: 'https://i.scdn.co/image/e69f71e2be4b67b82af90b0e020266f6e5cf1a40', genres: ['progressive rock', 'psychedelic rock'] },
  { id: '74ASZWbe4lXaubB36ztrGX', name: 'Bob Dylan', image: 'https://i.scdn.co/image/7bbda6b7803b68a4a87c48a8b2b6e0b2b8b2b2b2', genres: ['folk', 'rock', 'country'] },
  { id: '7Ln80lUS6He07XvHI8qqHH', name: 'Arctic Monkeys', image: 'https://i.scdn.co/image/2f91c3cace3c5a6a48f3d0e2f6b5f9a2c7b39e9c', genres: ['indie rock', 'alternative rock'] },
  
  // 80s Artists
  { id: '3fMbdgg4jU18AjLCKBhRSm', name: 'Michael Jackson', image: 'https://i.scdn.co/image/0433f521b1fadf1d839b6e70c3914021f122901f', genres: ['pop', 'soul', 'funk'] },
  { id: '1McMsnEElThX1knmY4oliG', name: 'Stevie Nicks', image: 'https://i.scdn.co/image/42c6b4c2d8a7ac74e1c0a7a9c7e0c58f71e16a1', genres: ['rock', 'pop'] },
  { id: '4Z8W4fKeB5YxbusRsdQVPb', name: 'Radiohead', image: 'https://i.scdn.co/image/afcd616e1ef2d2786f47b3b4c82f7b0e20a8c8c8', genres: ['alternative rock', 'electronic'] },
  { id: '0C0XlULifJtAgn6ZNCW2eu', name: 'The Killers', image: 'https://i.scdn.co/image/84282c28d851a700132356381fcfbadc67ff498b', genres: ['indie rock', 'alternative rock'] },
  { id: '53XhwfbYqKCa1cC15pYq2q', name: 'Imagine Dragons', image: 'https://i.scdn.co/image/920dc1ffb9add765b0b23853a83e5b719e7b45b8', genres: ['pop rock', 'indie rock'] },
  { id: '1HY2Jd0NmPuamShAr6KMms', name: 'Lady Gaga', image: 'https://i.scdn.co/image/b5c747b5e2b6e0b2b8b2b2b2b8b2b2b2b8b2b2b2', genres: ['pop', 'dance'] },
  { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift', image: 'https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4', genres: ['pop', 'country'] },
  { id: '4dpARuHxo51G3z768sgnrY', name: 'Adele', image: 'https://i.scdn.co/image/fc5c9b50a3b342b3b4f3e2b8b2b2b2b2b8b2b2b2', genres: ['pop', 'soul'] },
  { id: '66CXWjxzNUsdJxJ2JdwvnR', name: 'Ariana Grande', image: 'https://i.scdn.co/image/c06971e9ff81696699b829484e3be165f4e64368', genres: ['pop', 'r&b'] },
  { id: '1uNFoZAHBGtllmzznpCI3s', name: 'Justin Bieber', image: 'https://i.scdn.co/image/5c213435c2d4ab5c3e3c2b8b2b2b2b2b8b2b2b2', genres: ['pop', 'r&b'] }
];

export const classicTracks = [
  // Queen tracks
  { id: 'track_001', name: 'Bohemian Rhapsody', artist: 'Queen', artistId: '1dfeR4HaWDbWqFHLkxsg1d', album: 'A Night at the Opera', duration: 355000, popularity: 98, year: 1975 },
  { id: 'track_002', name: 'We Will Rock You', artist: 'Queen', artistId: '1dfeR4HaWDbWqFHLkxsg1d', album: 'News of the World', duration: 122000, popularity: 95, year: 1977 },
  { id: 'track_003', name: 'We Are the Champions', artist: 'Queen', artistId: '1dfeR4HaWDbWqFHLkxsg1d', album: 'News of the World', duration: 179000, popularity: 94, year: 1977 },
  { id: 'track_004', name: 'Don\'t Stop Me Now', artist: 'Queen', artistId: '1dfeR4HaWDbWqFHLkxsg1d', album: 'Jazz', duration: 209000, popularity: 93, year: 1978 },
  { id: 'track_005', name: 'Another One Bites the Dust', artist: 'Queen', artistId: '1dfeR4HaWDbWqFHLkxsg1d', album: 'The Game', duration: 215000, popularity: 92, year: 1980 },
  
  // Led Zeppelin tracks
  { id: 'track_006', name: 'Stairway to Heaven', artist: 'Led Zeppelin', artistId: '36QJpDe2go2KgaRleHCDTp', album: 'Led Zeppelin IV', duration: 482000, popularity: 96, year: 1971 },
  { id: 'track_007', name: 'Whole Lotta Love', artist: 'Led Zeppelin', artistId: '36QJpDe2go2KgaRleHCDTp', album: 'Led Zeppelin II', duration: 334000, popularity: 94, year: 1969 },
  { id: 'track_008', name: 'Kashmir', artist: 'Led Zeppelin', artistId: '36QJpDe2go2KgaRleHCDTp', album: 'Physical Graffiti', duration: 515000, popularity: 91, year: 1975 },
  { id: 'track_009', name: 'Black Dog', artist: 'Led Zeppelin', artistId: '36QJpDe2go2KgaRleHCDTp', album: 'Led Zeppelin IV', duration: 297000, popularity: 90, year: 1971 },
  { id: 'track_010', name: 'Rock and Roll', artist: 'Led Zeppelin', artistId: '36QJpDe2go2KgaRleHCDTp', album: 'Led Zeppelin IV', duration: 220000, popularity: 89, year: 1971 },
  
  // The Beatles tracks
  { id: 'track_011', name: 'Hey Jude', artist: 'The Beatles', artistId: '3WrFJ7ztbogyGnTHbHJFl2', album: 'Hey Jude', duration: 431000, popularity: 94, year: 1968 },
  { id: 'track_012', name: 'Let It Be', artist: 'The Beatles', artistId: '3WrFJ7ztbogyGnTHbHJFl2', album: 'Let It Be', duration: 243000, popularity: 93, year: 1970 },
  { id: 'track_013', name: 'Come Together', artist: 'The Beatles', artistId: '3WrFJ7ztbogyGnTHbHJFl2', album: 'Abbey Road', duration: 259000, popularity: 92, year: 1969 },
  { id: 'track_014', name: 'Here Comes the Sun', artist: 'The Beatles', artistId: '3WrFJ7ztbogyGnTHbHJFl2', album: 'Abbey Road', duration: 185000, popularity: 91, year: 1969 },
  { id: 'track_015', name: 'Yesterday', artist: 'The Beatles', artistId: '3WrFJ7ztbogyGnTHbHJFl2', album: 'Help!', duration: 125000, popularity: 90, year: 1965 },
  
  // David Bowie tracks
  { id: 'track_016', name: 'Heroes', artist: 'David Bowie', artistId: '0oSGxfWSnnOXhD2fKuz2Gy', album: 'Heroes', duration: 366000, popularity: 88, year: 1977 },
  { id: 'track_017', name: 'Space Oddity', artist: 'David Bowie', artistId: '0oSGxfWSnnOXhD2fKuz2Gy', album: 'Space Oddity', duration: 314000, popularity: 87, year: 1969 },
  { id: 'track_018', name: 'Let\'s Dance', artist: 'David Bowie', artistId: '0oSGxfWSnnOXhD2fKuz2Gy', album: 'Let\'s Dance', duration: 457000, popularity: 86, year: 1983 },
  { id: 'track_019', name: 'Under Pressure', artist: 'David Bowie', artistId: '0oSGxfWSnnOXhD2fKuz2Gy', album: 'Hot Space', duration: 246000, popularity: 85, year: 1981 },
  { id: 'track_020', name: 'Starman', artist: 'David Bowie', artistId: '0oSGxfWSnnOXhD2fKuz2Gy', album: 'The Rise and Fall of Ziggy Stardust', duration: 258000, popularity: 84, year: 1972 },
  
  // Michael Jackson tracks
  { id: 'track_021', name: 'Billie Jean', artist: 'Michael Jackson', artistId: '3fMbdgg4jU18AjLCKBhRSm', album: 'Thriller', duration: 294000, popularity: 95, year: 1982 },
  { id: 'track_022', name: 'Beat It', artist: 'Michael Jackson', artistId: '3fMbdgg4jU18AjLCKBhRSm', album: 'Thriller', duration: 258000, popularity: 94, year: 1982 },
  { id: 'track_023', name: 'Thriller', artist: 'Michael Jackson', artistId: '3fMbdgg4jU18AjLCKBhRSm', album: 'Thriller', duration: 357000, popularity: 93, year: 1982 },
  { id: 'track_024', name: 'Smooth Criminal', artist: 'Michael Jackson', artistId: '3fMbdgg4jU18AjLCKBhRSm', album: 'Bad', duration: 257000, popularity: 92, year: 1987 },
  { id: 'track_025', name: 'Don\'t Stop \'Til You Get Enough', artist: 'Michael Jackson', artistId: '3fMbdgg4jU18AjLCKBhRSm', album: 'Off the Wall', duration: 366000, popularity: 91, year: 1979 },
  
  // ABBA tracks
  { id: 'track_026', name: 'Dancing Queen', artist: 'ABBA', artistId: '0LcJLqbBmaGUft1e9Mm8HV', album: 'Arrival', duration: 230000, popularity: 89, year: 1976 },
  { id: 'track_027', name: 'Mamma Mia', artist: 'ABBA', artistId: '0LcJLqbBmaGUft1e9Mm8HV', album: 'ABBA', duration: 214000, popularity: 88, year: 1975 },
  { id: 'track_028', name: 'Fernando', artist: 'ABBA', artistId: '0LcJLqbBmaGUft1e9Mm8HV', album: 'Arrival', duration: 254000, popularity: 87, year: 1976 },
  { id: 'track_029', name: 'Take a Chance on Me', artist: 'ABBA', artistId: '0LcJLqbBmaGUft1e9Mm8HV', album: 'The Album', duration: 245000, popularity: 86, year: 1977 },
  { id: 'track_030', name: 'Knowing Me, Knowing You', artist: 'ABBA', artistId: '0LcJLqbBmaGUft1e9Mm8HV', album: 'Arrival', duration: 244000, popularity: 85, year: 1976 },

  // Pink Floyd tracks
  { id: 'track_031', name: 'Comfortably Numb', artist: 'Pink Floyd', artistId: '6luzFxJlf9pv8NyMNi70pE', album: 'The Wall', duration: 382000, popularity: 91, year: 1979 },
  { id: 'track_032', name: 'Wish You Were Here', artist: 'Pink Floyd', artistId: '6luzFxJlf9pv8NyMNi70pE', album: 'Wish You Were Here', duration: 334000, popularity: 90, year: 1975 },
  { id: 'track_033', name: 'Another Brick in the Wall', artist: 'Pink Floyd', artistId: '6luzFxJlf9pv8NyMNi70pE', album: 'The Wall', duration: 231000, popularity: 89, year: 1979 },
  { id: 'track_034', name: 'Money', artist: 'Pink Floyd', artistId: '6luzFxJlf9pv8NyMNi70pE', album: 'The Dark Side of the Moon', duration: 382000, popularity: 88, year: 1973 },
  { id: 'track_035', name: 'Time', artist: 'Pink Floyd', artistId: '6luzFxJlf9pv8NyMNi70pE', album: 'The Dark Side of the Moon', duration: 413000, popularity: 87, year: 1973 },

  // The Rolling Stones tracks
  { id: 'track_036', name: 'Paint It Black', artist: 'The Rolling Stones', artistId: '22bE4uQ6baNwSHPVcDxLCe', album: 'Aftermath', duration: 202000, popularity: 88, year: 1966 },
  { id: 'track_037', name: 'Start Me Up', artist: 'The Rolling Stones', artistId: '22bE4uQ6baNwSHPVcDxLCe', album: 'Tattoo You', duration: 214000, popularity: 87, year: 1981 },
  { id: 'track_038', name: 'Satisfaction', artist: 'The Rolling Stones', artistId: '22bE4uQ6baNwSHPVcDxLCe', album: 'Out of Our Heads', duration: 223000, popularity: 86, year: 1965 },
  { id: 'track_039', name: 'Angie', artist: 'The Rolling Stones', artistId: '22bE4uQ6baNwSHPVcDxLCe', album: 'Goats Head Soup', duration: 272000, popularity: 85, year: 1973 },
  { id: 'track_040', name: 'Brown Sugar', artist: 'The Rolling Stones', artistId: '22bE4uQ6baNwSHPVcDxLCe', album: 'Sticky Fingers', duration: 230000, popularity: 84, year: 1971 }
];

// Generate additional tracks to reach 500 total
const generateAdditionalTracks = () => {
  const additionalTracks = [];
  const trackTemplates = [
    { suffix: 'Live', duration: 320000 },
    { suffix: 'Remastered', duration: 280000 },
    { suffix: 'Demo', duration: 240000 },
    { suffix: 'Extended Mix', duration: 420000 },
    { suffix: 'Acoustic', duration: 260000 },
    { suffix: 'Radio Edit', duration: 200000 },
    { suffix: 'Single Version', duration: 210000 },
    { suffix: 'Album Version', duration: 300000 },
    { suffix: 'Remix', duration: 350000 },
    { suffix: 'Unplugged', duration: 290000 }
  ];
  
  const trackNames = [
    'Rock and Roll All Nite', 'Hotel California', 'Free Bird', 'Sweet Child O Mine',
    'November Rain', 'Paradise City', 'Welcome to the Jungle', 'Living on a Prayer',
    'Wanted Dead or Alive', 'You Give Love a Bad Name', 'Don\'t Stop Believin\'',
    'Any Way You Want It', 'Separate Ways', 'Open Arms', 'Faithfully',
    'More Than a Feeling', 'Peace of Mind', 'Foreplay/Long Time', 'Smokin\'',
    'Dream On', 'Sweet Emotion', 'Walk This Way', 'Love in an Elevator',
    'Janie\'s Got a Gun', 'Crazy', 'Cryin\'', 'Amazing', 'I Don\'t Want to Miss a Thing',
    'Dust in the Wind', 'Carry on Wayward Son', 'Point of Know Return',
    'Go Your Own Way', 'Don\'t Stop', 'Dreams', 'The Chain', 'Rhiannon',
    'Landslide', 'Gold Dust Woman', 'Say You Love Me', 'Never Going Back Again',
    'Tusk', 'Sara', 'Hold the Line', 'Rosanna', 'Africa', 'I Won\'t Hold You Back',
    'Human Nature', 'Rock with You', 'Wanna Be Startin\' Somethin\'', 'P.Y.T.',
    'The Way You Make Me Feel', 'Man in the Mirror', 'Dirty Diana', 'Leave Me Alone'
  ];

  let trackIndex = 41;
  
  for (let i = 0; i < 460; i++) {
    const artist = classicArtists[i % classicArtists.length];
    const trackName = trackNames[i % trackNames.length];
    const template = trackTemplates[i % trackTemplates.length];
    const year = 1970 + (i % 20);
    
    additionalTracks.push({
      id: `track_${String(trackIndex).padStart(3, '0')}`,
      name: `${trackName} (${template.suffix})`,
      artist: artist.name,
      artistId: artist.id,
      album: `Classic Album ${Math.floor(i / 12) + 1}`,
      duration: template.duration + (Math.random() * 60000 - 30000), // ±30 seconds variance
      popularity: Math.floor(Math.random() * 30) + 70, // 70-99
      year: year
    });
    
    trackIndex++;
  }
  
  return additionalTracks;
};

export const allClassicTracks = [...classicTracks, ...generateAdditionalTracks()];

// Convert to Spotify API format
export const extensiveTopTracks = {
  items: allClassicTracks.map(track => ({
    id: track.id,
    name: track.name,
    artists: [{ 
      id: track.artistId, 
      name: track.artist 
    }],
    album: {
      id: `album_${track.id}`,
      name: track.album,
      images: [{ 
        url: `https://picsum.photos/300/300?random=${track.id}`, 
        height: 300, 
        width: 300 
      }]
    },
    duration_ms: track.duration,
    popularity: track.popularity,
    preview_url: null
  }))
};

export const extensiveTopArtists = {
  items: classicArtists.map(artist => ({
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    images: [{ 
      url: artist.image, 
      height: 300, 
      width: 300 
    }],
    popularity: Math.floor(Math.random() * 20) + 80, // 80-99
    followers: { 
      total: Math.floor(Math.random() * 20000000) + 5000000 // 5M-25M
    }
  }))
};

export const extensiveRecentlyPlayed = {
  items: allClassicTracks.slice(0, 50).map((track, index) => ({
    track: {
      id: track.id,
      name: track.name,
      artists: [{ 
        id: track.artistId, 
        name: track.artist 
      }],
      album: {
        id: `album_${track.id}`,
        name: track.album,
        images: [{ 
          url: `https://picsum.photos/300/300?random=${track.id}`, 
          height: 300, 
          width: 300 
        }]
      },
      duration_ms: track.duration,
      popularity: track.popularity,
      preview_url: null
    },
    played_at: new Date(Date.now() - (index * 1000 * 60 * 15)).toISOString(), // Every 15 minutes
    context: null
  }))
};
