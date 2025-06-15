
import React from 'react';
import { ExternalLink, Github, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-foreground">Spotify Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An independent, open-source project showcasing music analytics with a beautiful Spotify-inspired design. 
              Built with React, TypeScript, and modern web technologies.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-foreground">Legal & Disclaimers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Not affiliated with Spotify AB</li>
              <li>• Non-commercial MIT licensed project</li>
              <li>• Educational and demonstration purposes only</li>
              <li>• Spotify® is a trademark of Spotify AB</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-foreground">Open Source</h4>
            <div className="space-y-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <Github className="h-4 w-4" />
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-xs text-muted-foreground">
                Licensed under MIT License
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Spotify Analytics Dashboard. This project is not affiliated with Spotify AB.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500" /> for music lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
