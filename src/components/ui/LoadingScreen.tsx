import React, { useState, useEffect } from 'react';
import { Music, Disc3, Headphones, Radio, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

const musicFacts = [
  // Classical & Historical
  "Beethoven continued composing masterpieces even after losing his hearing completely.",
  "Mozart composed over 600 works during his short 35-year life.",
  "The oldest known musical instrument is a 60,000-year-old Neanderthal flute made from a bear bone.",
  "Johann Sebastian Bach had 20 children and many became famous musicians.",
  "Vivaldi wrote over 500 concertos, with 'The Four Seasons' being his most famous.",
  "The piano was invented around 1700 by Bartolomeo Cristofori in Italy.",
  "Chopin's 'Minute Waltz' actually takes about 2 minutes to play properly.",
  "Tchaikovsky's '1812 Overture' was written to commemorate Russia's defense against Napoleon.",
  "Stradivarius violins are still considered the finest ever made, crafted in the 17th-18th centuries.",
  "The accordion was invented in Vienna in 1829 and became popular worldwide.",
  
  // World Music & Cultural
  "The didgeridoo is possibly the world's oldest wind instrument, dating back 65,000 years.",
  "India has over 300 classical ragas, each meant to evoke specific emotions and times of day.",
  "The African drum language called 'talking drums' can communicate across vast distances.",
  "Flamenco guitar originated in Andalusia, Spain, blending Gypsy, Jewish, and Moorish influences.",
  "The Japanese shamisen has only three strings but can produce hundreds of different sounds.",
  "Irish traditional music uses modes that are over 1,000 years old.",
  "The Chinese guqin is considered the instrument of the wise, with over 3,000 compositions.",
  "Gamelan orchestras from Indonesia can have over 40 musicians playing together.",
  "The sitar has 18-21 strings, with only 6-7 being played and the rest resonating sympathetically.",
  "Mariachi bands traditionally have at least 5 musicians, each playing different instruments.",
  
  // Modern & Popular Music
  "The Beatles hold the record for the most number-one hits on the Billboard Hot 100.",
  "The electric guitar was invented in 1931 by George Beauchamp and Adolph Rickenbacker.",
  "Hip-hop was born in the 1970s in the Bronx, New York, at block parties.",
  "The first music video played on MTV was 'Video Killed the Radio Star' by The Buggles.",
  "Michael Jackson's 'Thriller' is the best-selling album of all time.",
  "The synthesizer was invented in the 1960s and revolutionized electronic music.",
  "Punk rock emerged in the mid-1970s as a reaction against mainstream rock.",
  "Reggae music originated in Jamaica in the late 1960s, popularized by Bob Marley.",
  "The first rap song to hit #1 on Billboard was 'Rapture' by Blondie in 1981.",
  "Disco music peaked in the 1970s and influenced modern electronic dance music.",
  
  // Science & Psychology
  "Listening to music releases dopamine, the same chemical released when eating or falling in love.",
  "The 'Mozart effect' suggests classical music may temporarily boost spatial-temporal reasoning.",
  "Music therapy is used to treat depression, anxiety, and even help stroke patients recover speech.",
  "Earworms (stuck songs) happen because music creates loops in the auditory cortex.",
  "Perfect pitch is possessed by less than 1% of the population.",
  "The human brain processes music in both hemispheres, unlike most other activities.",
  "Listening to music can reduce perceived pain by up to 21%.",
  "Music synchronizes brainwaves, which is why it's used in meditation and therapy.",
  "The tempo of music can affect heart rate and breathing patterns.",
  "Musicians have larger corpus callosums, the bridge between brain hemispheres.",
  
  // Technology & Innovation
  "The first sound recording was made in 1860 by Édouard-Léon Scott de Martinville.",
  "Thomas Edison's phonograph in 1877 was the first device to both record and reproduce sound.",
  "The first digital audio recording was made by Japanese company Denon in 1972.",
  "Auto-Tune was invented in 1997 by Dr. Andy Hildebrand, an oil industry engineer.",
  "Spotify processes over 70,000 tracks uploaded every single day.",
  "The MP3 format was developed in Germany and became the standard for digital music.",
  "The first iPod could hold 'about 1,000 songs' and was released in 2001.",
  "Shazam can identify songs from just a few seconds of audio using acoustic fingerprinting.",
  "The world's first synthesizer concert was performed in 1964 in New York.",
  "MIDI (Musical Instrument Digital Interface) was introduced in 1983 to connect electronic instruments.",
  
  // Record Breaking & Unusual
  "The longest officially recorded song is 'The Rise and Fall of Bossanova' at 13 hours, 23 minutes.",
  "The highest note ever sung by a human was a G10, achieved by Georgia Brown.",
  "The largest musical instrument ever built is the Boardwalk Hall Auditorium Organ in Atlantic City.",
  "The fastest rap verse was performed by Eminem in 'Rap God' at 9.6 syllables per second.",
  "The most expensive musical instrument sold was a Stradivarius violin for $16 million.",
  "The world's smallest violin is only 1.6 inches long and actually playable.",
  "The oldest song with known lyrics is the 'Hurrian Hymn' from 1400 BCE.",
  "The most-covered song in history is 'Yesterday' by The Beatles with over 2,200 versions.",
  "The longest musical performance lasted 639 years - John Cage's 'As Slow As Possible.'",
  "The most people singing in unison was 121,440 in India in 2011.",
  
  // Instruments & Sounds
  "The human voice is the most versatile instrument, capable of producing infinite sounds.",
  "A violin has over 70 individual pieces of wood in its construction.",
  "The pipe organ is considered the 'king of instruments' due to its range and power.",
  "The bass guitar was invented to bridge the gap between guitar and double bass.",
  "Wind chimes were invented in China around 1100 BCE to ward off evil spirits.",
  "The theremin is played without physical contact, using electromagnetic fields.",
  "A grand piano has about 12,000 individual parts and 220 strings.",
  "The ocarina is one of the oldest wind instruments, dating back 12,000 years.",
  "The harmonica is the world's best-selling musical instrument.",
  "The xylophone's name comes from Greek words meaning 'wood sound.'",
  
  // Global Music Traditions
  "Throat singing from Mongolia can produce up to 4 notes simultaneously.",
  "The yodeling technique originated in the Swiss Alps as a way to communicate across valleys.",
  "African polyrhythms use multiple rhythmic patterns simultaneously.",
  "The Brazilian berimbau is the lead instrument in capoeira martial arts.",
  "Celtic music uses pentatonic scales that create its distinctive haunting sound.",
  "The Australian didgeridoo requires circular breathing to play continuously.",
  "Native American flutes are traditionally made from cedar wood.",
  "The West African kora has 21 strings and is played like a harp-lute hybrid.",
  "Turkish classical music uses a 24-tone octave instead of the Western 12-tone system.",
  "The Persian santur influenced the development of the piano.",
  
  // Unusual Music Facts
  "Cows produce more milk when listening to music slower than 100 beats per minute.",
  "Plants may grow faster when exposed to classical music, according to some studies.",
  "The 'Happy Birthday' song was copyrighted until 2016 and earned millions in royalties.",
  "Metallica is the first band to have performed on all seven continents, including Antarctica.",
  "The shortest song ever charted was 'You Suffer' by Napalm Death at 1.316 seconds.",
  "Finland has the most metal bands per capita of any country in the world.",
  "The Beatles used the word 'love' 613 times in their songs.",
  "The song 'Tequila' by The Champs only has one word in its lyrics.",
  "Monaco's national anthem has no official lyrics, only music.",
  "The song 'Louie Louie' by The Kingsmen was investigated by the FBI for obscene lyrics.",
  
  // Music and Memory
  "Alzheimer's patients often remember songs from their youth even when other memories fade.",
  "The 'reminiscence bump' explains why music from ages 10-30 feels most meaningful.",
  "Musicians have better memory recall than non-musicians due to enhanced neural connections.",
  "Familiar songs activate the same brain regions as autobiographical memories.",
  "The brain can recognize a familiar song in as little as 100 milliseconds.",
  "Music training in childhood can improve verbal memory throughout life.",
  "Instrumental music is often better for concentration than music with lyrics.",
  "The 'spacing effect' means musical skills learned over time are retained longer.",
  "Rhythmic patterns help encode memories, which is why we remember song lyrics easily.",
  "Emotional music creates stronger memory associations than neutral music.",
  
  // Cultural Impact & Evolution
  "Protest songs have shaped social movements throughout history.",
  "The waltz was once considered scandalous because partners danced face-to-face.",
  "Jazz was America's first major cultural export to the world.",
  "The electric guitar changed the sound of music more than any other 20th-century invention.",
  "Folk music preserves cultural traditions and stories across generations.",
  "The gramophone democratized music by making it accessible to everyone.",
  "Music festivals date back to ancient Greece with competitions honoring the gods.",
  "The Blues evolved from African American work songs and spirituals.",
  "Rock and roll emerged from a fusion of country, blues, and rhythm & blues.",
  "World music fusion has created countless new genres and styles.",
  
  // Streaming & Digital Age
  "Over 70 million songs are available on major streaming platforms.",
  "The average person listens to music for 18 hours per week.",
  "Streaming now accounts for over 80% of music industry revenue.",
  "The most-streamed song on Spotify has over 3 billion plays.",
  "Playlists have become the new radio, curated by algorithms and users.",
  "Social media has created viral music trends that spread globally in hours.",
  "Independent artists can now reach global audiences without record labels.",
  "Music discovery happens 73% through streaming platform recommendations.",
  "The 'skip rate' for new songs is highest in the first 30 seconds.",
  "Collaborative playlists allow friends to create shared musical experiences.",
  
  // Neurological & Health Benefits
  "Drumming releases endorphins and can reduce stress hormones.",
  "Singing in groups synchronizes heartbeats among participants.",
  "Music therapy helps premature babies gain weight and develop faster.",
  "Learning an instrument can delay cognitive decline in aging.",
  "Background music at 60-70 BPM can improve focus and productivity.",
  "Music before surgery can reduce anxiety as effectively as medication.",
  "Rhythmic music helps Parkinson's patients improve their gait and balance.",
  "Lullabies are universal across cultures and help regulate infant sleep cycles.",
  "Music activates the brain's reward center, releasing natural opioids.",
  "Group singing boosts immune system function and reduces inflammation.",
  
  // Surprising Origins
  "The word 'music' comes from the Greek 'mousike,' meaning 'art of the Muses.'",
  "Karaoke was invented in Japan in 1971 by Daisuke Inoue.",
  "The first jukebox was invented in 1889 and played Edison wax cylinders.",
  "The term 'disc jockey' was coined in 1937 by radio commentator Walter Winchell.",
  "The saxophone was invented in 1840 by Adolphe Sax to bridge brass and woodwinds.",
  "The electric keyboard was invented in 1919 by Russian inventor Lev Termen.",
  "The first music video was created in 1926 for 'St. Louis Blues.'",
  "The concept of background music was invented by Muzak in 1934.",
  "The first gold record was awarded to Glenn Miller for 'Chattanooga Choo Choo' in 1942.",
  "The Grammy Awards were created in 1958 to honor recording artists.",
  
  // Mathematical & Acoustic
  "Musical intervals are based on mathematical ratios discovered by Pythagoras.",
  "An octave represents a doubling of frequency - if A is 440 Hz, the next A is 880 Hz.",
  "The 'golden ratio' appears in many classical compositions' structures.",
  "Sound travels at 343 meters per second in air at room temperature.",
  "The human ear can detect sounds from 20 Hz to 20,000 Hz.",
  "Resonance can make instruments sound louder without adding power.",
  "The Doppler effect changes pitch when sound sources move relative to listeners.",
  "Standing waves in concert halls can create dead spots where sound cancels out.",
  "The logarithmic scale means each octave represents the same perceptual interval.",
  "Harmonic series explains why some note combinations sound consonant or dissonant.",
  
  // Future & Innovation
  "AI is now composing music that can fool human listeners.",
  "Virtual reality concerts are creating new immersive musical experiences.",
  "Haptic technology lets deaf people feel music through vibrations.",
  "Binaural beats claim to alter brainwave states through specific frequencies.",
  "3D audio creates spatial sound experiences with regular headphones.",
  "Genetic algorithms are being used to evolve new musical compositions.",
  "Brain-computer interfaces may one day let us compose music with thought alone.",
  "Quantum computing could revolutionize music synthesis and analysis.",
  "Smart speakers are changing how we discover and interact with music.",
  "Machine learning personalizes music recommendations with increasing accuracy.",
  
  // Fun & Quirky
  "The longest piano piece ever composed is Vexations by Erik Satie, meant to be played 840 times.",
  "Honey bees can be trained to detect different musical notes.",
  "The rubber duck song 'Rubber Duckie' by Ernie reached #16 on Billboard in 1970.",
  "Cats prefer music composed specifically for them, with frequencies matching their vocalizations.",
  "The macarena was originally a flamenco song before becoming a dance craze.",
  "Whale songs can travel thousands of miles underwater.",
  "The oldest known musical notation is over 4,000 years old from ancient Sumeria.",
  "Songbirds learn their melodies the same way human children learn to speak.",
  "The 'ice cream truck song' is actually a traditional folk tune called 'Turkey in the Straw.'",
  "Penguins can recognize their mates' calls among thousands of other penguins.",
  
  // More Modern Music
  "Hip-hop is now the most popular music genre in the United States.",
  "The first rap recording was 'Rapper's Delight' by The Sugarhill Gang in 1979.",
  "Electronic Dance Music (EDM) festivals attract millions of attendees worldwide.",
  "Dubstep originated in South London in the early 2000s.",
  "K-pop has become a global phenomenon, with BTS being the first Korean act to top Billboard 200.",
  "The 808 drum machine, released in 1980, became the backbone of hip-hop production.",
  "Sampling in hip-hop has created legal battles and new copyright laws.",
  "The first CD was produced in 1982 and could hold 74 minutes of music.",
  "Vinyl records have made a comeback, with sales increasing every year since 2006.",
  "The 'loudness war' has made modern music increasingly compressed and louder.",
  
  // More Cultural & Historical
  "The first opera was 'Dafne' by Jacopo Peri, performed in 1598.",
  "The waltz originated in the Austrian and German countryside in the 1770s.",
  "Country music evolved from folk music brought by British immigrants to the American South.",
  "The blues scale uses flattened third, fifth, and seventh notes to create its distinctive sound.",
  "Salsa music originated in New York City in the 1960s, blending Cuban and Puerto Rican styles.",
  "The tango was born in Buenos Aires in the 1880s and was initially considered vulgar.",
  "Bossa nova emerged in Brazil in the late 1950s, meaning 'new trend' in Portuguese.",
  "Ska music from Jamaica in the 1960s was a precursor to reggae.",
  "The British Invasion of the 1960s was led by The Beatles and changed American music forever.",
  "Motown Records created the 'Motown Sound' that dominated soul music in the 1960s.",
  
  // More Science & Health
  "Music training improves mathematical abilities in children.",
  "Premature babies exposed to music show improved brain development.",
  "The brain's musical processing is so complex it uses nearly every neural network.",
  "Perfect pitch is more common in tonal language speakers like Mandarin or Vietnamese.",
  "Music can help stroke patients recover speech through melodic intonation therapy.",
  "Rhythmic training can improve reading skills in children with dyslexia.",
  "Musicians are less likely to develop dementia than non-musicians.",
  "Listening to music while exercising can increase endurance by up to 20%.",
  "Music therapy is effective in treating autism spectrum disorders.",
  "The 'cocktail party effect' allows us to focus on one conversation in a noisy room.",
  
  // More Technology
  "The first computer-generated music was created in 1957 at Bell Labs.",
  "Digital signal processing has revolutionized how we create and manipulate sound.",
  "The vocoder, invented in 1938, was originally designed for telephone encryption.",
  "Sampling rates of 44.1 kHz were chosen for CDs to match video equipment standards.",
  "Compression algorithms like MP3 remove sounds the human ear can't perceive.",
  "Artificial intelligence can now master audio tracks with professional quality.",
  "Spatial audio creates 3D soundscapes that move around the listener.",
  "Machine learning algorithms can separate individual instruments from mixed recordings.",
  "Blockchain technology is being explored for music rights management.",
  "5G networks enable real-time collaborative music creation across the globe.",
  
  // More Records & Extremes
  "The largest choir ever assembled had 121,440 people in Chennai, India.",
  "The most expensive music video ever made was Michael Jackson's 'Scream' at $7 million.",
  "The longest concert by multiple artists lasted 453 hours in Germany.",
  "The most people playing guitar simultaneously was 6,346 in Poland.",
  "The oldest person to have a #1 hit was Tony Bennett at age 95.",
  "The youngest person to write a #1 hit was Stevie Wonder at age 13.",
  "The best-selling single of all time is 'White Christmas' by Bing Crosby.",
  "The most weeks at #1 for a single song is 19 weeks by 'Old Town Road.'",
  "The fastest-selling album in history was Adele's '25' with 3.38 million copies in its first week.",
  "The most Grammy Awards won by a single artist is 32 by Beyoncé."
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading your music data...", 
  className 
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [displayedFacts, setDisplayedFacts] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Shuffle facts for variety
    const shuffledFacts = [...musicFacts].sort(() => Math.random() - 0.5);
    setDisplayedFacts(shuffledFacts);
  }, []);

  useEffect(() => {
    if (displayedFacts.length === 0) return;

    const factInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % displayedFacts.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(factInterval);
  }, [displayedFacts]);

  const icons = [Music, Disc3, Headphones, Radio, Sparkles];
  const IconComponent = icons[currentFactIndex % icons.length];

  return (
    <div className={cn(
      "min-h-screen bg-background flex items-center justify-center p-6",
      className
    )}>
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-card/80 backdrop-blur-sm rounded-full p-8 border border-border/50 shadow-lg">
            <IconComponent className="h-16 w-16 mx-auto text-primary animate-bounce" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient-primary">
            {message}
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full animate-pulse" 
               style={{ width: '60%' }} />
        </div>

        {/* Music Fact Card */}
        {displayedFacts.length > 0 && (
          <div className={cn(
            "bg-card/80 backdrop-blur-sm rounded-lg p-6 border border-border/50 shadow-lg transition-all duration-300 card-hover",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-gradient-primary rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold text-accent mb-2">
                  Did you know?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {displayedFacts[currentFactIndex]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fun Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-card/60 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="text-primary font-bold text-lg">200+</div>
            <div className="text-muted-foreground">Music Facts</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="text-accent font-bold text-lg">70M+</div>
            <div className="text-muted-foreground">Songs Online</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="text-secondary font-bold text-lg">195</div>
            <div className="text-muted-foreground">Countries</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="text-primary font-bold text-lg">∞</div>
            <div className="text-muted-foreground">Possibilities</div>
          </div>
        </div>

        {/* Subtle hint */}
        <p className="text-xs text-muted-foreground/70">
          Preparing your personalized music insights...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;