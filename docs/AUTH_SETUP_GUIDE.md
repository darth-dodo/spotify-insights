# Authentication Setup & Troubleshooting Guide

## 🚀 Quick Setup (5 minutes)

### 1. **Create Spotify App**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create app"
3. Fill in:
   - **App name**: Your app name
   - **App description**: Any description
   - **Redirect URI**: `http://localhost:5173/callback` (for development)
   - **API/SDKs**: Web API ✅

### 2. **Environment Configuration**
Create `.env.local` in your project root:

```env
# Required: Your Spotify app credentials
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback

# Optional: Development settings
VITE_USE_DUMMY_DATA=false
```

### 3. **Test Authentication**
```bash
npm run dev
# Visit http://localhost:5173
# Click "Connect Spotify Account"
```

## 🔧 Common Issues & Fixes

### **Issue 1: "Client ID not configured"**
**Error**: `Spotify Client ID not configured`
**Fix**: 
- Ensure `.env.local` exists with `VITE_SPOTIFY_CLIENT_ID`
- Restart dev server after adding environment variables
- Check console for validation messages

### **Issue 2: "Invalid redirect URI"**
**Error**: `redirect_uri_mismatch`
**Fix**: 
- In Spotify Dashboard → Settings → Redirect URIs
- Add: `http://localhost:5173/callback`
- For production: `https://yourdomain.com/callback`

### **Issue 3: Double login required**
**Status**: ✅ **FIXED** - This was resolved in recent updates
**Cause**: Duplicate token exchange calls
**Fix**: Already implemented with guards in `CallbackPage.tsx`

### **Issue 4: Stuck on loading screen**
**Symptoms**: Loading screen never disappears
**Fixes**:
1. **Check token expiry**: Clear localStorage and retry
2. **Network issues**: Check browser dev tools for API errors
3. **Rate limiting**: Wait 1-2 minutes and retry

### **Issue 5: 403 Playback errors**
**Error**: "Invalid token scopes" for playback features
**Fix**: This is expected - playback requires Spotify Premium and special app review
**Workaround**: App gracefully handles this and continues without playback features

## 🔍 Debugging Steps

### 1. **Check Environment Variables**
```javascript
// In browser console
console.log('CLIENT_ID:', import.meta.env.VITE_SPOTIFY_CLIENT_ID);
```

### 2. **Check Token Storage**
```javascript
// In browser console
console.log('Token:', localStorage.getItem('spotify_access_token'));
console.log('Expiry:', new Date(parseInt(localStorage.getItem('spotify_token_expiry'))));
```

### 3. **Clear Auth Data**
```javascript
// In browser console - clears all auth data
['spotify_access_token', 'spotify_refresh_token', 'spotify_token_expiry', 'user_profile']
  .forEach(key => localStorage.removeItem(key));
location.reload();
```

## 📋 Verification Checklist

- [ ] Spotify app created with correct redirect URI
- [ ] `.env.local` file exists with CLIENT_ID
- [ ] Dev server restarted after adding environment variables
- [ ] Browser localStorage is clear of old tokens
- [ ] Network allows requests to `accounts.spotify.com` and `api.spotify.com`

## 🛠 Advanced Troubleshooting

### **Auth Flow Debugging**
Enable verbose logging by adding to your `.env.local`:
```env
VITE_DEBUG_AUTH=true
```

### **Manual Token Refresh**
If tokens expire, the app automatically refreshes them. Force refresh:
```javascript
// In authenticated state
window.location.reload(); // Triggers token validation
```

### **Demo Mode**
For testing without Spotify account:
```env
VITE_USE_DUMMY_DATA=true
```
Or visit: `http://localhost:5173/sandbox`

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use HTTPS in production** for redirect URIs
3. **Regularly rotate client secrets** in Spotify Dashboard
4. **Monitor token usage** in Spotify Dashboard analytics

## 📞 Still Having Issues?

1. **Check browser console** for detailed error messages
2. **Verify Spotify API status** at [Spotify Status](https://status.spotify.com)
3. **Review recent changes** in `CHANGELOG.md`
4. **Check authentication improvements** in `docs/AUTHENTICATION_IMPROVEMENTS.md`

---

*Last updated: 2024 - Based on latest authentication system improvements* 