import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Info, TrendingUp, Clock, Music, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  calculation?: string;
  funFacts?: string[];
  metrics?: { label: string; value: string; description: string }[];
  dataSource?: 'api' | 'real-time' | 'calculated' | 'estimated';
  confidence?: 'high' | 'medium' | 'low';
}

export const InfoModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  calculation, 
  funFacts = [],
  metrics = [],
  dataSource = 'calculated',
  confidence = 'medium'
}: InfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <DialogDescription className="text-sm leading-relaxed">
            {description}
          </DialogDescription>
          
          {calculation && (
            <div className="p-3 bg-muted/30 rounded-lg border">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                How it's calculated
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {calculation}
              </p>
            </div>
          )}
          
          {metrics.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Key Metrics</h4>
              {metrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-accent/5 rounded">
                  <div>
                    <div className="text-sm font-medium">{metric.label}</div>
                    <div className="text-xs text-muted-foreground">{metric.description}</div>
                  </div>
                  <Badge variant="secondary">{metric.value}</Badge>
                </div>
              ))}
            </div>
          )}
          
          {funFacts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Music className="h-4 w-4" />
                Fun Facts
              </h4>
              <div className="space-y-2">
                {funFacts.map((fact, index) => (
                  <div key={index} className="p-2 bg-primary/5 rounded border-l-2 border-primary/20">
                    <p className="text-xs text-muted-foreground">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Data Source */}
          <div className="p-3 bg-muted/30 rounded-lg border">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Data Quality
            </h4>
            <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
              We classify every metric by <em>source</em> and <em>confidence</em>.
              This one is based on <strong>{getSourceLabel(dataSource)}</strong> and currently carries a
              <strong> {confidence.toUpperCase()}</strong> confidence score.
              Confidence rises automatically as more real-time data becomes available.
            </p>
          </div>
          <Link to="/data-quality" className="text-xs text-primary underline" onClick={onClose}>
            Learn more about Data Quality
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// helper
function getSourceLabel(src: string) {
  switch (src) {
    case 'api':
      return 'direct Spotify API values';
    case 'real-time':
      return 'live session tracking';
    case 'calculated':
      return 'advanced calculations (live + historical)';
    default:
      return 'heuristic estimates';
  }
}
