import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useTheme } from '@/hooks/useTheme';

interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
  steps: Step[];
}

export const OnboardingTour = ({
  isOpen,
  onComplete,
  onSkip,
  steps
}: OnboardingTourProps) => {
  const [run, setRun] = useState(false);
  const { theme } = useTheme();
  const isDark = theme.includes('dark');

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM elements are ready
      const timer = setTimeout(() => {
        setRun(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setRun(false);
    }
  }, [isOpen]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action } = data;

    // Log for debugging
    console.log('Joyride callback:', { status, type, action });

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
      if (status === STATUS.FINISHED) {
        onComplete();
      } else if (status === STATUS.SKIPPED) {
        onSkip();
      }
    }

    // Handle errors (e.g., target not found)
    if (status === STATUS.ERROR) {
      console.warn('Joyride encountered an error - target element may not be found');
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous={true}
      run={run}
      scrollToFirstStep={true}
      scrollOffset={60}
      showProgress={true}
      showSkipButton={true}
      steps={steps}
      disableScrolling={false}
      disableScrollParentFix={false}
      disableOverlay={false}
      spotlightClicks={true}
      spotlightPadding={6}
      scrollDuration={300}
      debug={false}
      styles={{
        options: {
          primaryColor: isDark ? 'hsl(217 91% 65%)' : 'hsl(217 91% 60%)',
          width: 350,
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
          backgroundColor: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(0 0% 100%)',
          border: isDark ? '1px solid hsl(217.2 32.6% 20%)' : '1px solid hsl(220 13% 91%)',
          boxShadow: isDark 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '350px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipTitle: {
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: 8,
          color: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
          lineHeight: 1.4,
        },
        tooltipContent: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
          color: isDark ? 'hsl(215 20.2% 70%)' : 'hsl(215.4 16.3% 44%)',
          margin: 0,
        },
        buttonNext: {
          backgroundColor: isDark ? 'hsl(217 91% 65%)' : 'hsl(217 91% 60%)',
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          border: 'none',
          color: 'white',
        },
        buttonBack: {
          color: isDark ? 'hsl(217 91% 65%)' : 'hsl(217 91% 60%)',
          marginRight: 8,
          fontSize: '0.875rem',
          fontWeight: 500,
          backgroundColor: 'transparent',
          border: isDark ? '1px solid hsl(217 91% 65%)' : '1px solid hsl(217 91% 60%)',
          borderRadius: 6,
          padding: '8px 12px',
        },
        buttonSkip: {
          color: isDark ? 'hsl(215 20.2% 70%)' : 'hsl(215.4 16.3% 44%)',
          fontSize: '0.875rem',
          backgroundColor: 'transparent',
          border: 'none',
        },
        buttonClose: {
          width: 24,
          height: 24,
          right: 8,
          top: 8,
          color: isDark ? 'hsl(215 20.2% 70%)' : 'hsl(215.4 16.3% 44%)',
          backgroundColor: 'transparent',
          border: 'none',
        },
        spotlight: {
          borderRadius: 8,
          border: `2px solid ${isDark ? 'hsl(217 91% 65%)' : 'hsl(217 91% 60%)'}`,
          boxShadow: isDark
            ? '0 0 0 2px rgba(59, 130, 246, 0.15)'
            : '0 0 0 2px rgba(59, 130, 246, 0.1)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          mixBlendMode: 'normal',
        },
        overlayLegacy: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        beacon: {
          borderRadius: '50%',
          border: `2px solid ${isDark ? 'hsl(217 91% 65%)' : 'hsl(217 91% 60%)'}`,
          backgroundColor: isDark ? 'hsl(217 91% 65%)' : 'hsl(217 91% 60%)',
        }
      }}
      locale={{
        back: 'Back',
        close: '×',
        last: 'Finish',
        next: 'Next',
        open: 'Open the dialog',
        skip: 'Skip',
      }}
      floaterProps={{
        disableAnimation: false,
        hideArrow: false,
        offset: 10,
        styles: {
          floater: {
            filter: 'none',
          },
          arrow: {
            length: 6,
            spread: 12,
            color: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(0 0% 100%)',
          }
        }
      }}
      disableCloseOnEsc={false}
      disableOverlayClose={false}
      hideCloseButton={false}
    />
  );
};

// Predefined tour steps for the dashboard - using React Joyride format
export const dashboardTourSteps: Step[] = [
  {
    target: '#stats-overview-section',
    title: '🎵 Welcome to Your Music Dashboard!',
    content: 'These cards show your key music statistics at a glance. Each card represents different aspects of your listening habits - from your total library size to genre diversity. Click on any card to dive deeper into the insights!',
    placement: 'bottom' as const,
    disableBeacon: true,
    offset: 20,
    styles: {
      tooltip: {
        maxWidth: '320px',
      }
    }
  },
  {
    target: '#gamification-section',
    title: '🏆 Level Up Your Music Journey',
    content: 'Track your musical exploration through our achievement system! Earn XP by discovering new artists, exploring genres, and maintaining listening streaks. Watch your music taste evolve with unlockable badges and level progression.',
    placement: 'bottom' as const,
    disableBeacon: true,
    offset: 20,
    styles: {
      tooltip: {
        maxWidth: '320px',
      }
    }
  },
  {
    target: '[data-tour="sidebar"]',
    title: '🧭 Explore Your Music Universe',
    content: 'This sidebar is your navigation hub! Each section reveals different aspects of your musical journey:<br/><br/>• <strong>Discovery:</strong> Explore tracks, artists, and genres<br/>• <strong>Analytics:</strong> View trends and library health<br/>• <strong>Experience:</strong> Achievements and settings',
    placement: 'right' as const,
    disableBeacon: true,
    offset: 10,
    styles: {
      tooltip: {
        maxWidth: '300px',
      }
    }
  },
  {
    target: '#top-tracks-section',
    title: '🎤 Your Musical DNA',
    content: 'This section showcases your most beloved tracks with rich details about each song. You\'ll see popularity scores, duration, and can even open tracks directly in Spotify. These tracks represent your core musical identity!',
    placement: 'top' as const,
    disableBeacon: true,
    offset: 15,
    styles: {
      tooltip: {
        maxWidth: '320px',
      }
    }
  },
  {
    target: '[data-tour="profile-menu"]',
    title: '🔒 Privacy-First Design',
    content: 'Your privacy is our priority! All data processing happens locally on your device - nothing is sent to external servers. Access additional settings, privacy controls, and help resources through this menu. You can restart this tour anytime!',
    placement: 'bottom' as const,
    disableBeacon: true,
    offset: 5,
    styles: {
      tooltip: {
        maxWidth: '300px',
      }
    }
  }
];

// Hook to manage onboarding state
export const useOnboarding = () => {
  const [showTour, setShowTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('onboarding-tour-completed');
    if (!tourCompleted) {
      // Show tour after a brief delay to let the page load
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenTour(true);
    }
  }, []);

  const completeTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('onboarding-tour-completed', 'true');
  };

  const skipTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('onboarding-tour-completed', 'true');
  };

  const restartTour = () => {
    setShowTour(true);
    setHasSeenTour(false);
  };

  return {
    showTour,
    hasSeenTour,
    completeTour,
    skipTour,
    restartTour
  };
}; 