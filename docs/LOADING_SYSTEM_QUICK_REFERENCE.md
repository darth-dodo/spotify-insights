# Loading System Quick Reference

## 🚀 Essential Components

### LoadingProvider
```typescript
// Wrap your app
<LoadingProvider>
  <App />
  <GlobalLoader />
</LoadingProvider>

// Use in components
const { stage, pct, setStage, bump } = useLoading();
```

### Loading Stages
```typescript
type LoadingStage = 'idle' | 'oauth' | 'profile' | 'library';

// Progress through stages
setStage('oauth');    // Start authentication
setStage('profile');  // Load user profile  
setStage('library');  // Load music data
```

### Progress Management
```typescript
// Increment progress
bump(25);  // Add 25% to current progress
bump(50);  // Now at 75% total
bump(25);  // Complete at 100%

// Check current progress
console.log(pct); // Current percentage
```

## 🎯 Quick Implementation

### Basic Data Loading Pattern
```typescript
const loadUserData = async () => {
  try {
    setStage('oauth');
    await authenticate();
    bump(25);
    
    setStage('profile');
    await fetchProfile();
    bump(25);
    
    setStage('library');
    await fetchTracks();
    bump(25);
    
    await fetchArtists();
    bump(25); // Complete
  } catch (error) {
    console.error('Loading failed:', error);
  }
};
```

### Custom Loading Steps
```typescript
const customSteps = [
  {
    id: 'auth',
    title: 'Authenticating',
    description: 'Verifying credentials',
    icon: Shield,
    estimatedTime: 2
  },
  {
    id: 'data',
    title: 'Loading Data',
    description: 'Fetching your information',
    icon: Download,
    estimatedTime: 5
  }
];

<ProgressiveLoader
  steps={customSteps}
  currentStep={currentStep}
  progress={progress}
/>
```

## 🎨 Visual Components

### EnhancedLoadingScreen
```typescript
<EnhancedLoadingScreen
  currentStep={2}
  progress={75}
  showTips={true}
  onComplete={() => console.log('Done!')}
/>
```

### ProgressiveLoader
```typescript
<ProgressiveLoader
  steps={spotifyLoadingSteps}
  currentStep={currentStep}
  progress={progress}
  className="custom-loader"
/>
```

## 🔧 Common Patterns

### Sequential Loading
```typescript
// Load data one after another
setStage('profile');
await loadProfile();
bump(33);

setStage('library');
await loadTracks();
bump(33);

await loadArtists();
bump(34); // Total: 100%
```

### Parallel Loading
```typescript
// Load multiple things at once
setStage('library');
const [tracks, artists, recent] = await Promise.all([
  loadTracks().then(r => { bump(33); return r; }),
  loadArtists().then(r => { bump(33); return r; }),
  loadRecent().then(r => { bump(34); return r; })
]);
```

### Error Handling
```typescript
const safeLoad = async () => {
  try {
    setStage('profile');
    await loadData();
    bump(100);
  } catch (error) {
    console.error('Load failed:', error);
    // Show error state or retry
  }
};
```

## 🎯 Stage-to-Step Mapping

| Stage | Step Index | Description |
|-------|------------|-------------|
| `oauth` | 0 | Authentication |
| `profile` | 0-1 | User profile (0-50% = step 0, 50-100% = step 1) |
| `library` | 1-3 | Music data (1=tracks, 2=artists, 3=recent) |

## 📊 Default Loading Steps

```typescript
const spotifyLoadingSteps = [
  { id: 'profile', title: 'Connecting Profile', estimatedTime: 3 },
  { id: 'tracks', title: 'Analyzing Music Library', estimatedTime: 8 },
  { id: 'artists', title: 'Mapping Artist Universe', estimatedTime: 5 },
  { id: 'recent', title: 'Processing Activity', estimatedTime: 4 }
];
```

## 🎨 Customization

### Custom Messages
```typescript
const customFacts = [
  "🎵 Your custom loading message!",
  "🔍 Another engaging fact...",
  "⚡ Keep users interested!"
];
```

### Custom Styling
```css
.enhanced-progress-bar {
  background: linear-gradient(90deg, #your-color, #accent);
}

.loading-step-active {
  background: your-brand-color;
  box-shadow: 0 0 20px rgba(your-color, 0.3);
}
```

## 🐛 Debugging

### Check Progress
```typescript
const { stage, pct } = useLoading();
console.log('Stage:', stage, 'Progress:', pct);
```

### Verify Cleanup
```typescript
useEffect(() => {
  const timer = setInterval(updateProgress, 1000);
  return () => clearInterval(timer); // Essential!
}, []);
```

### Performance Monitor
```typescript
const LoadingDebugger = () => {
  const { stage, pct } = useLoading();
  return (
    <div className="fixed top-0 right-0 bg-black text-white p-2">
      Stage: {stage} | Progress: {pct}%
    </div>
  );
};
```

## ⚡ Performance Tips

1. **Memoize calculations**: Use `useMemo()` for expensive operations
2. **Cleanup timers**: Always clear intervals in useEffect cleanup
3. **Throttle updates**: Limit progress updates to ~60fps
4. **Lazy load**: Use dynamic imports for heavy components

## 🎯 Best Practices

1. **Progress should add to 100%**: Plan your bump() calls
2. **Handle errors gracefully**: Always wrap async operations
3. **Provide feedback**: Users should know what's happening
4. **Test edge cases**: Empty data, network failures, etc.
5. **Accessibility**: Add ARIA labels and announcements

## 📱 Mobile Considerations

- Reduce animation complexity on mobile
- Consider reduced motion preferences
- Test on slower devices
- Optimize for touch interactions

---

**For detailed implementation:** See [LOADING_SYSTEM_IMPLEMENTATION.md](./LOADING_SYSTEM_IMPLEMENTATION.md)  
**For product strategy:** See [LOADING_EXPERIENCE_OVERHAUL.md](./LOADING_EXPERIENCE_OVERHAUL.md) 