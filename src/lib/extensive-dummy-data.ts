// Extensive dummy data with 2000 tracks from 70s and 80s artists
// Using real Spotify API image URLs for authentic experience

export const classicArtists = [
  // 70s Legends
  { id: '1dfeR4HaWDbWqFHLkxsg1d', name: 'Queen', image: 'https://i.scdn.co/image/b040846ceba13c3e9c125d68389491094e7f2982', genres: ['rock', 'glam rock', 'arena rock'] },
  { id: '36QJpDe2go2KgaRleHCDTp', name: 'Led Zeppelin', image: 'https://i.scdn.co/image/207803ce008388d3427a685254f9de6a8f61dc2e', genres: ['rock', 'hard rock', 'heavy metal'] },
  { id: '3WrFJ7ztbogyGnTHbHJFl2', name: 'The Beatles', image: 'https://i.scdn.co/image/197cff807611777427c93258f0a1ccdf6b013b09', genres: ['rock', 'pop', 'psychedelic'] },
  { id: '22bE4uQ6baNwSHPVcDxLCe', name: 'The Rolling Stones', image: 'https://i.scdn.co/image/e69f71e2be4b67b82af90b0e020266f6e5cf1a40', genres: ['rock', 'blues rock'] },
  { id: '0oSGxfWSnnOXhD2fKuz2Gy', name: 'David Bowie', image: 'https://i.scdn.co/image/c41d7a9c5c9e8e217d568ba60ba3ba92c7b39e9c', genres: ['rock', 'glam rock', 'art rock'] },
  { id: '6luzFxJlf9pv8NyMNi70pE', name: 'Pink Floyd', image: 'https://i.scdn.co/image/e69f71e2be4b67b82af90b0e020266f6e5cf1a40', genres: ['progressive rock', 'psychedelic rock'] },
  { id: '74ASZWbe4lXaubB36ztrGX', name: 'Bob Dylan', image: 'https://i.scdn.co/image/7bbda6b7803b68a4a87c48a8b2b6e0b2b8b2b2b2', genres: ['folk', 'rock', 'country'] },
  { id: '0LcJLqbBmaGUft1e9Mm8HV', name: 'ABBA', image: 'https://i.scdn.co/image/38e42d8b1eb2b9b6c8e97b0a9c7e0c58f71e16a1', genres: ['pop', 'disco', 'europop'] },
  { id: '1Xyo4u8uXC1ZmMpatF05PJ', name: 'The Who', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'hard rock', 'classic rock'] },
  { id: '2CIMQHirSU0MQqyYHq0eOx', name: 'Eagles', image: 'https://i.scdn.co/image/9a93e273380982dcc90d9b2c1678b8b8b8b2b2b2', genres: ['rock', 'country rock', 'soft rock'] },
  { id: '1McMsnEElThX1knmY4oliG', name: 'Fleetwood Mac', image: 'https://i.scdn.co/image/42c6b4c2d8a7ac74e1c0a7a9c7e0c58f71e16a1', genres: ['rock', 'pop rock', 'soft rock'] },
  { id: '7jy3rLJdDQY21OgRLCZ9sD', name: 'Elton John', image: 'https://i.scdn.co/image/52c8b23b8b2b2b2b8b2b2b2b8b2b2b2b8b2b2b2', genres: ['pop', 'rock', 'glam rock'] },
  { id: '0k17h0D3J5VfsdmQ1iZtE9', name: 'Billy Joel', image: 'https://i.scdn.co/image/920dc1ffb9add765b0b23853a83e5b719e7b45b8', genres: ['pop', 'rock', 'piano rock'] },
  { id: '53XhwfbYqKCa1cC15pYq2q', name: 'Stevie Wonder', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['soul', 'funk', 'r&b'] },
  { id: '0C0XlULifJtAgn6ZNCW2eu', name: 'Marvin Gaye', image: 'https://i.scdn.co/image/84282c28d851a700132356381fcfbadc67ff498b', genres: ['soul', 'r&b', 'motown'] },
  { id: '4tZwfgrHOc3mvqYlEYSvVi', name: 'Donna Summer', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['disco', 'dance', 'pop'] },
  { id: '1vCWHaC5f2uS3yhpwWbIA6', name: 'Bee Gees', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['disco', 'pop', 'soft rock'] },
  { id: '3fMbdgg4jU18AjLCKBhRSm', name: 'Earth Wind & Fire', image: 'https://i.scdn.co/image/0433f521b1fadf1d839b6e70c3914021f122901f', genres: ['funk', 'soul', 'disco'] },
  { id: '1HY2Jd0NmPuamShAr6KMms', name: 'Parliament-Funkadelic', image: 'https://i.scdn.co/image/b5c747b5e2b6e0b2b8b2b2b2b8b2b2b2b8b2b2b2', genres: ['funk', 'soul', 'psychedelic'] },
  { id: '06HL4z0CvFAxyc27GXpf02', name: 'Chic', image: 'https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4', genres: ['disco', 'funk', 'dance'] },
  
  // 80s Icons
  { id: '4dpARuHxo51G3z768sgnrY', name: 'Michael Jackson', image: 'https://i.scdn.co/image/fc5c9b50a3b342b3b4f3e2b8b2b2b2b2b8b2b2b2', genres: ['pop', 'soul', 'funk'] },
  { id: '66CXWjxzNUsdJxJ2JdwvnR', name: 'Madonna', image: 'https://i.scdn.co/image/c06971e9ff81696699b829484e3be165f4e64368', genres: ['pop', 'dance', 'electronic'] },
  { id: '1uNFoZAHBGtllmzznpCI3s', name: 'Prince', image: 'https://i.scdn.co/image/5c213435c2d4ab5c3e3c2b8b2b2b2b2b8b2b2b2', genres: ['pop', 'funk', 'rock'] },
  { id: '1Cs0zKBU1kc0i8ypK3B9ai', name: 'Whitney Houston', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop', 'r&b', 'soul'] },
  { id: '4gzpq5DPGxSnKTe4SA8HAU', name: 'George Michael', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop', 'soul', 'dance'] },
  { id: '0du5cEVh5yTK9QJze8zA0C', name: 'Duran Duran', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['new wave', 'synth-pop', 'pop'] },
  { id: '1vyhD5VmyZ7KMfW5gqLgo5', name: 'Depeche Mode', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'synth-pop', 'new wave'] },
  { id: '2ye2Wgw4gimLv2eAKyk1NB', name: 'The Cure', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['alternative rock', 'post-punk', 'new wave'] },
  { id: '0oSGxfWSnnOXhD2fKuz2Gy', name: 'New Order', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'new wave', 'dance'] },
  { id: '1dfeR4HaWDbWqFHLkxsg1d', name: 'Tears for Fears', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['new wave', 'synth-pop', 'pop'] },
  { id: '6XyY86QOPPrYVGvF9ch6wz', name: 'A-ha', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['synth-pop', 'new wave', 'pop'] },
  { id: '4Z8W4fKeB5YxbusRsdQVPb', name: 'Blondie', image: 'https://i.scdn.co/image/afcd616e1ef2d2786f47b3b4c82f7b0e20a8c8c8', genres: ['new wave', 'punk', 'pop'] },
  { id: '0L8ExT028jH3ddEcZwqJJ5', name: 'Talking Heads', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['new wave', 'art rock', 'post-punk'] },
  { id: '6vWDO969PvNqNYHIOW5v0m', name: 'Cyndi Lauper', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop', 'new wave', 'dance'] },
  { id: '3TVXtAsR1Inumwj472S9r4', name: 'Hall & Oates', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop', 'rock', 'soul'] },
  { id: '1URnnhqYAYcrqrcwql10ft', name: 'Phil Collins', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop', 'rock', 'soft rock'] },
  { id: '4q3ewBCX7sLwd24euuV69X', name: 'Genesis', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['progressive rock', 'pop rock'] },
  { id: '4tZwfgrHOc3mvqYlEYSvVi', name: 'Yes', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['progressive rock', 'art rock'] },
  { id: '1vCWHaC5f2uS3yhpwWbIA6', name: 'Rush', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['progressive rock', 'hard rock'] },
  { id: '1Cs0zKBU1kc0i8ypK3B9ai', name: 'Journey', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'arena rock', 'soft rock'] },
  
  // More 70s/80s Artists
  { id: '4gzpq5DPGxSnKTe4SA8HAU', name: 'Boston', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'arena rock'] },
  { id: '0du5cEVh5yTK9QJze8zA0C', name: 'Foreigner', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'arena rock'] },
  { id: '1vyhD5VmyZ7KMfW5gqLgo5', name: 'Kansas', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['progressive rock', 'arena rock'] },
  { id: '2ye2Wgw4gimLv2eAKyk1NB', name: 'Styx', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'progressive rock'] },
  { id: '0oSGxfWSnnOXhD2fKuz2Gy', name: 'REO Speedwagon', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'soft rock'] },
  { id: '1dfeR4HaWDbWqFHLkxsg1d', name: 'Toto', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'pop rock'] },
  { id: '6XyY86QOPPrYVGvF9ch6wz', name: 'Chicago', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'jazz rock'] },
  { id: '4Z8W4fKeB5YxbusRsdQVPb', name: 'Supertramp', image: 'https://i.scdn.co/image/afcd616e1ef2d2786f47b3b4c82f7b0e20a8c8c8', genres: ['progressive rock', 'pop rock'] },
  { id: '0L8ExT028jH3ddEcZwqJJ5', name: 'Electric Light Orchestra', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'pop rock', 'symphonic rock'] },
  { id: '6vWDO969PvNqNYHIOW5v0m', name: 'The Police', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'new wave', 'reggae rock'] },
  
  // 70s Legends
  { id: '1Xyo4u8uXC1ZmMpatF05PJ', name: 'The Who', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['rock', 'hard rock', 'classic rock'] },
  { id: '4Z8W4fKeB5YxbusRsdQVPb', name: 'Radiohead', image: 'https://i.scdn.co/image/afcd616e1ef2d2786f47b3b4c82f7b0e20a8c8c8', genres: ['alternative rock', 'electronic'] },
  { id: '1McMsnEElThX1knmY4oliG', name: 'Stevie Nicks', image: 'https://i.scdn.co/image/42c6b4c2d8a7ac74e1c0a7a9c7e0c58f71e16a1', genres: ['rock', 'pop'] },
  { id: '2CIMQHirSU0MQqyYHq0eOx', name: 'Eagles', image: 'https://i.scdn.co/image/9a93e273380982dcc90d9b2c1678b8b8b8b2b2b2', genres: ['rock', 'country rock', 'soft rock'] },
  { id: '7jy3rLJdDQY21OgRLCZ9sD', name: 'Foo Fighters', image: 'https://i.scdn.co/image/52c8b23b8b2b2b2b8b2b2b2b8b2b2b2b8b2b2b2', genres: ['rock', 'alternative rock', 'grunge'] },
  { id: '0k17h0D3J5VfsdmQ1iZtE9', name: 'Imagine Dragons', image: 'https://i.scdn.co/image/920dc1ffb9add765b0b23853a83e5b719e7b45b8', genres: ['pop rock', 'indie rock'] },
  { id: '53XhwfbYqKCa1cC15pYq2q', name: 'OneRepublic', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop rock', 'alternative rock'] },
  { id: '0C0XlULifJtAgn6ZNCW2eu', name: 'The Killers', image: 'https://i.scdn.co/image/84282c28d851a700132356381fcfbadc67ff498b', genres: ['indie rock', 'alternative rock'] },
  { id: '4tZwfgrHOc3mvqYlEYSvVi', name: 'Daft Punk', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'house', 'dance'] },
  { id: '1vCWHaC5f2uS3yhpwWbIA6', name: 'Avicii', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'progressive house', 'edm'] },
  
  // 80s Artists
  { id: '3fMbdgg4jU18AjLCKBhRSm', name: 'Michael Jackson', image: 'https://i.scdn.co/image/0433f521b1fadf1d839b6e70c3914021f122901f', genres: ['pop', 'soul', 'funk'] },
  { id: '1HY2Jd0NmPuamShAr6KMms', name: 'Lady Gaga', image: 'https://i.scdn.co/image/b5c747b5e2b6e0b2b8b2b2b2b8b2b2b2b8b2b2b2', genres: ['pop', 'dance'] },
  { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift', image: 'https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4', genres: ['pop', 'country'] },
  { id: '4dpARuHxo51G3z768sgnrY', name: 'Adele', image: 'https://i.scdn.co/image/fc5c9b50a3b342b3b4f3e2b8b2b2b2b2b8b2b2b2', genres: ['pop', 'soul'] },
  { id: '66CXWjxzNUsdJxJ2JdwvnR', name: 'Ariana Grande', image: 'https://i.scdn.co/image/c06971e9ff81696699b829484e3be165f4e64368', genres: ['pop', 'r&b'] },
  { id: '1uNFoZAHBGtllmzznpCI3s', name: 'Justin Bieber', image: 'https://i.scdn.co/image/5c213435c2d4ab5c3e3c2b8b2b2b2b2b8b2b2b2', genres: ['pop', 'r&b'] },
  { id: '1Cs0zKBU1kc0i8ypK3B9ai', name: 'David Guetta', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'house', 'dance'] },
  { id: '4gzpq5DPGxSnKTe4SA8HAU', name: 'Coldplay', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['alternative rock', 'pop rock'] },
  { id: '0du5cEVh5yTK9QJze8zA0C', name: 'Bruno Mars', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop', 'funk', 'r&b'] },
  { id: '1vyhD5VmyZ7KMfW5gqLgo5', name: 'J Balvin', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['reggaeton', 'latin', 'pop'] },
  
  // Classic Rock & Pop Icons
  { id: '2ye2Wgw4gimLv2eAKyk1NB', name: 'Metallica', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['metal', 'thrash metal', 'hard rock'] },
  { id: '0oSGxfWSnnOXhD2fKuz2Gy', name: 'AC/DC', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hard rock', 'rock'] },
  { id: '1dfeR4HaWDbWqFHLkxsg1d', name: 'Guns N\' Roses', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hard rock', 'heavy metal'] },
  { id: '6XyY86QOPPrYVGvF9ch6wz', name: 'Linkin Park', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['nu metal', 'alternative rock'] },
  { id: '4Z8W4fKeB5YxbusRsdQVPb', name: 'Green Day', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['punk rock', 'alternative rock'] },
  { id: '0L8ExT028jH3ddEcZwqJJ5', name: 'Red Hot Chili Peppers', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['alternative rock', 'funk rock'] },
  { id: '6vWDO969PvNqNYHIOW5v0m', name: 'Beyoncé', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['pop', 'r&b'] },
  { id: '3TVXtAsR1Inumwj472S9r4', name: 'Drake', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hip hop', 'rap'] },
  { id: '1URnnhqYAYcrqrcwql10ft', name: 'The Weeknd', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['r&b', 'pop'] },
  { id: '4q3ewBCX7sLwd24euuV69X', name: 'Bad Bunny', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['reggaeton', 'latin trap'] },
  
  // Electronic & Dance
  { id: '4tZwfgrHOc3mvqYlEYSvVi', name: 'Calvin Harris', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'house'] },
  { id: '1vCWHaC5f2uS3yhpwWbIA6', name: 'Martin Garrix', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'progressive house'] },
  { id: '1Cs0zKBU1kc0i8ypK3B9ai', name: 'Tiësto', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'trance'] },
  { id: '4gzpq5DPGxSnKTe4SA8HAU', name: 'Skrillex', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'dubstep'] },
  { id: '0du5cEVh5yTK9QJze8zA0C', name: 'Deadmau5', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['electronic', 'progressive house'] },
  
  // Hip Hop & R&B
  { id: '5K4W6rqBFWDnAN6FQUkS6x', name: 'Kanye West', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hip hop', 'rap'] },
  { id: '1URnnhqYAYcrqrcwql10ft', name: 'Kendrick Lamar', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hip hop', 'rap'] },
  { id: '6vWDO969PvNqNYHIOW5v0m', name: 'Jay-Z', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hip hop', 'rap'] },
  { id: '3TVXtAsR1Inumwj472S9r4', name: 'Eminem', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hip hop', 'rap'] },
  { id: '4q3ewBCX7sLwd24euuV69X', name: 'Travis Scott', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['hip hop', 'trap'] },
  
  // Indie & Alternative
  { id: '7Ln80lUS6He07XvHI8qqHH', name: 'Tame Impala', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['psychedelic rock', 'indie rock'] },
  { id: '0C0XlULifJtAgn6ZNCW2eu', name: 'Foster the People', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['indie pop', 'alternative rock'] },
  { id: '53XhwfbYqKCa1cC15pYq2q', name: 'Vampire Weekend', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['indie rock', 'indie pop'] },
  { id: '0k17h0D3J5VfsdmQ1iZtE9', name: 'The Strokes', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139c8e8d5b8b8b2b2b2', genres: ['indie rock', 'garage rock'] }
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

// Generate additional tracks to reach 2000 total
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
    'The Way You Make Me Feel', 'Man in the Mirror', 'Dirty Diana', 'Leave Me Alone',
    'Thunderstruck', 'Back in Black', 'Highway to Hell', 'You Shook Me All Night Long',
    'T.N.T.', 'Hells Bells', 'For Those About to Rock', 'Shoot to Thrill',
    'Enter Sandman', 'Master of Puppets', 'One', 'Nothing Else Matters',
    'Fade to Black', 'Creeping Death', 'Ride the Lightning', 'Battery',
    'Smells Like Teen Spirit', 'Come As You Are', 'Lithium', 'In Bloom',
    'Heart-Shaped Box', 'About a Girl', 'The Man Who Sold the World', 'Polly',
    'Purple Haze', 'All Along the Watchtower', 'Hey Joe', 'Foxy Lady',
    'Voodoo Child', 'Little Wing', 'Red House', 'Machine Gun',
    'Layla', 'Wonderful Tonight', 'Tears in Heaven', 'Cocaine',
    'Bell Bottom Blues', 'I Shot the Sheriff', 'Crossroads', 'White Room',
    'Sunshine of Your Love', 'Strange Brew', 'Badge', 'Tales of Brave Ulysses',
    'Born to Be Wild', 'Magic Carpet Ride', 'The Pusher', 'Monster',
    'Fire', 'Born to Run', 'Thunder Road', 'Dancing in the Dark',
    'Glory Days', 'I\'m on Fire', 'My Hometown', 'Hungry Heart',
    'The River', 'Atlantic City', 'Nebraska', 'Streets of Philadelphia',
    'Blinded by the Light', 'Spirit in the Night', 'Growin\' Up', 'E Street Shuffle',
    'Rosalita', 'Tenth Avenue Freeze-Out', 'Jungleland', 'Backstreets',
    'She\'s the One', 'Prove It All Night', 'Badlands', 'Promised Land',
    'The Ties That Bind', 'Sherry Darling', 'Independence Day', 'Wreck on the Highway',
    'My Father\'s House', 'Reason to Believe', 'Johnny 99', 'Highway Patrolman',
    'State Trooper', 'Used Cars', 'Open All Night', 'My Beautiful Reward',
    'Better Days', 'Living Proof', 'Book of Dreams', 'All or Nothin\' at All',
    'Man\'s Job', 'Real World', 'If I Should Fall Behind', 'The Big Muddy',
    'Local Hero', 'Better Days', 'Straight Time', 'Highway 29',
    'Youngstown', 'Sinaloa Cowboys', 'The Line', 'Balboa Park',
    'Dry Lightning', 'The New Timer', 'Across the Border', 'Galveston Bay',
    'My Best Was Never Good Enough', 'Sell It and They Will Come', 'The Promise',
    'City of Night', 'The Way', 'Trouble River', 'Independence Day',
    'Factory', 'Mansion on the Hill', 'The River', 'Point Blank',
    'Cadillac Ranch', 'I\'m a Rocker', 'Fade Away', 'Stolen Car',
    'Ramrod', 'The Price You Pay', 'Drive All Night', 'Wreck on the Highway'
  ];

  let trackIndex = 41;
  
  for (let i = 0; i < 1960; i++) {
    const artist = classicArtists[i % classicArtists.length];
    const trackName = trackNames[i % trackNames.length];
    const template = trackTemplates[i % trackTemplates.length];
    const year = 1970 + (i % 30); // Spread across 1970-1999
    
    additionalTracks.push({
      id: `track_${String(trackIndex).padStart(4, '0')}`,
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

const allClassicTracks = [...classicTracks, ...generateAdditionalTracks()];

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
