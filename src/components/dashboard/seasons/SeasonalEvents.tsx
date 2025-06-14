
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, Crown, Gift, Calendar, Zap, Trophy, 
  Music, Heart, Sparkles, Target, Award
} from 'lucide-react';

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  progress: number;
  maxProgress: number;
  rewards: string[];
  participants: number;
  icon: React.ReactNode;
}

export const SeasonalEvents = () => {
  const events: SeasonalEvent[] = [
    {
      id: 'summer_vibes',
      name: 'Summer Vibes Festival',
      description: 'Celebrate summer with upbeat tracks and sunny melodies. Complete challenges to earn exclusive summer badges!',
      theme: 'Summer',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      isActive: true,
      progress: 45,
      maxProgress: 100,
      rewards: ['Summer Vibes Badge', 'Beach Party Playlist', '500 Bonus XP', 'Golden Sun Crown'],
      participants: 12847,
      icon: <Star className="h-6 w-6" />
    },
    {
      id: 'new_artist_discovery',
      name: 'New Artist Discovery Week',
      description: 'Discover emerging artists and support new talent. First 1000 participants get special rewards!',
      theme: 'Discovery',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
      isActive: true,
      progress: 23,
      maxProgress: 50,
      rewards: ['Pioneer Badge', 'Emerging Artist Playlist', '300 XP', 'Discovery Crown'],
      participants: 8934,
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      id: 'throwback_challenge',
      name: 'Throwback Thursday Challenge',
      description: 'Take a musical journey through the decades. Listen to classics from each era to complete the challenge.',
      theme: 'Retro',
      startDate: '2024-06-10',
      endDate: '2024-06-17',
      isActive: false,
      progress: 100,
      maxProgress: 100,
      rewards: ['Time Traveler Badge', 'Vintage Collection', '750 XP', 'Retro Master Title'],
      participants: 15623,
      icon: <Crown className="h-6 w-6" />
    }
  ];

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'Summer': return 'from-yellow-400 to-orange-500';
      case 'Discovery': return 'from-purple-400 to-pink-500';
      case 'Retro': return 'from-blue-400 to-purple-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Event ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days left`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours left`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-accent" />
          Seasonal Events
        </h2>
        <p className="text-muted-foreground">
          Participate in limited-time events for exclusive rewards and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map(event => (
          <Card 
            key={event.id} 
            className={`transition-all duration-300 ${
              event.isActive 
                ? 'shadow-lg hover:shadow-xl border-accent/30' 
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getThemeGradient(event.theme)} text-white`}>
                    {event.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={event.isActive ? 'default' : 'secondary'}
                        className={event.isActive ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {event.isActive ? 'Active' : 'Completed'}
                      </Badge>
                      <Badge variant="outline">{event.theme}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {event.isActive ? getTimeRemaining(event.endDate) : 'Completed'}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription>{event.description}</CardDescription>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your Progress</span>
                  <span className="font-medium">{event.progress} / {event.maxProgress}</span>
                </div>
                <Progress value={(event.progress / event.maxProgress) * 100} className="h-2" />
              </div>
              
              {/* Participants */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4" />
                <span>{event.participants.toLocaleString()} participants</span>
              </div>
              
              {/* Rewards */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Event Rewards:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.rewards.map((reward, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {reward}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Action Button */}
              <div className="pt-2">
                {event.isActive ? (
                  <Button className="w-full" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    View Challenges
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" size="sm" disabled>
                    <Award className="h-4 w-4 mr-2" />
                    Event Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Events Preview */}
      <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Get ready for these upcoming seasonal events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-background/50 rounded-lg border">
              <h4 className="font-medium mb-2">🍂 Autumn Classics Festival</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Celebrate fall with cozy indie tracks and acoustic sessions
              </p>
              <Badge variant="outline" className="text-xs">
                Starting September 1st
              </Badge>
            </div>
            <div className="p-4 bg-background/50 rounded-lg border">
              <h4 className="font-medium mb-2">🎃 Halloween Horror Soundtracks</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Spooky sounds and horror movie themes for the season
              </p>
              <Badge variant="outline" className="text-xs">
                Starting October 15th
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
