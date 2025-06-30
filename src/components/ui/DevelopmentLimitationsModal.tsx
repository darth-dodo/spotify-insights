import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  XCircle,
  CheckCircle,
  Star,
  Heart,
  Info
} from 'lucide-react';

interface DevelopmentLimitationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DevelopmentLimitationsModal: React.FC<DevelopmentLimitationsModalProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>🚧 Development Mode Limitations</span>
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-amber-800 dark:text-amber-200 mt-2">
            This app operates under Spotify's Development Mode with significant access restrictions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Restrictions Column */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 sm:p-5 border border-red-200 dark:border-red-700">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                  Real Data Access Restrictions
                </h4>
                <ul className="text-red-800 dark:text-red-200 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <strong>Maximum 25 users</strong> can access real Spotify data
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <strong>Manual allowlisting required</strong> via Spotify Developer Dashboard
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <strong>No automated approval</strong> - requires app owner intervention
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <strong>Permanent limitation</strong> for personal projects
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 sm:p-5 border border-orange-200 dark:border-orange-700">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                  Extended Access Requirements
                </h4>
                <ul className="text-orange-800 dark:text-orange-200 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <div>
                      <strong>250,000+ monthly active users</strong> required
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <div>
                      <strong>Established business entity</strong> with commercial viability
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <div>
                      <strong>Proven track record</strong> and business case
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <div>
                      <strong>Individual developers excluded</strong> from extended access
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Solutions Column */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 sm:p-5 border border-emerald-200 dark:border-emerald-700">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2 sm:mb-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                    Sandbox Mode Available
                  </div>
                  <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 self-start sm:self-auto">
                    Recommended
                  </Badge>
                </h4>
                <ul className="text-emerald-800 dark:text-emerald-200 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <div>
                      <strong>No limitations</strong> - anyone can access instantly
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <div>
                      <strong>Full feature set</strong> with realistic demo data
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <div>
                      <strong>500+ sample tracks</strong> for comprehensive testing
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <div>
                      <strong>Complete analytics experience</strong> without restrictions
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 sm:p-5 border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                  Our Recommendation
                </h4>
                <div className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm space-y-2">
                  <p>
                    <strong>Try Sandbox Mode first!</strong> It showcases all features and capabilities with realistic data that demonstrates the full potential of the platform.
                  </p>
                  <p>
                    If you love the experience and want to use your real Spotify data, you can then consider requesting allowlist access for the limited real data mode.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
              Why These Limitations Exist
            </h4>
            <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm space-y-2">
              <p>
                These restrictions are part of Spotify's API policy to prevent abuse and ensure quality applications. 
                As of 2025, Spotify maintains strict controls on which applications can access unlimited user data.
              </p>
              <p>
                Personal projects and indie developers typically remain in Development Mode permanently, 
                which is why we've invested heavily in creating a comprehensive Sandbox Mode that provides 
                the complete experience without limitations.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 