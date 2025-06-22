# 🔐 User Access Guide for Spotify Insights

## Overview

This guide explains how user access works for Spotify Insights, including limitations, restrictions, and how to add users to your app.

## 🚨 Important Limitations

### Development Mode (Current Status)
Spotify Insights operates in **Development Mode**, which means:

- ✅ **Up to 25 users** can authenticate and use the app
- ✅ **Any Spotify user** can attempt to log in
- ❌ **Non-allowlisted users get 403 errors** when making API requests
- ❌ **Users must be manually added** to the app's allowlist

### Extended Quota Mode (Restricted)
As of **May 15, 2025**, Spotify has significantly restricted Extended Quota access:

- ❌ **Organizations only** - no individual developers accepted
- ❌ **Requires 250k+ monthly active users**
- ❌ **Must be an established business entity**
- ❌ **Commercial viability required**

## 🔧 How to Add Users (Development Mode)

### Step-by-Step Instructions

1. **Go to Spotify Developer Dashboard**
   - Visit [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
   - Log in with your Spotify account

2. **Select Your App**
   - Click on your "Spotify Insights" app

3. **Navigate to User Management**
   - Click on **Settings**
   - Click on **User Management** tab

4. **Add New User**
   - Click **Add New User**
   - Enter the user's **full name**
   - Enter their **Spotify email address** (must match their Spotify account)
   - Click **Save**

5. **Notify the User**
   - Send them your app URL
   - They can now log in and access real Spotify data

### Important Notes

- Users **must use the same email** they registered with Spotify
- You can add **up to 25 users total**
- Changes may take a few minutes to take effect
- Users not on the allowlist will see authentication errors

## 🎯 User Experience by Mode

### ✅ Allowlisted Users (Development Mode)
- Full access to all features
- Real Spotify data analysis
- All dashboard components work
- Can see their actual music insights

### ❌ Non-Allowlisted Users
- Can complete login flow
- Will receive **403 Forbidden** errors
- Limited to sandbox/demo mode
- Cannot access real Spotify data

### 🎮 Sandbox Mode (Anyone)
- No authentication required
- Works for all visitors
- Uses demo data
- Full feature demonstration

## 📊 Current App Status

### Development Mode Features
- **User Limit**: 25 authenticated users
- **API Access**: Full Web API access
- **Rate Limits**: Standard development limits
- **Scopes**: All requested scopes available
- **Review**: No Spotify review required

### What Works for Everyone
- **Landing Page**: Public access
- **Sandbox Mode**: Demo with sample data
- **Documentation**: All public documentation
- **Error Handling**: Graceful degradation

## 🚀 Recommendations

### For App Owner
1. **Maintain User List**: Keep track of who you've added
2. **Monitor Usage**: Check if users are actually using the app
3. **Remove Inactive Users**: Free up slots for new users
4. **Provide Clear Instructions**: Help users understand access requirements

### For New Users
1. **Provide Spotify Email**: Must match your Spotify account
2. **Wait for Approval**: Owner must manually add you
3. **Try Sandbox First**: Test features with demo data
4. **Report Issues**: Help improve the app

### For Organizations
1. **Consider Requirements**: 250k+ MAU requirement is very high
2. **Business Entity**: Must be legally registered organization
3. **Commercial Use**: Must demonstrate business viability
4. **Alternative Approaches**: Consider other integration methods

## 🔍 Troubleshooting

### Common Issues

#### "403 Forbidden" Errors
- **Cause**: User not on allowlist
- **Solution**: Ask app owner to add you via Developer Dashboard

#### "Authentication Failed"
- **Cause**: Wrong email or account mismatch
- **Solution**: Verify email matches Spotify account

#### "Rate Limited"
- **Cause**: Too many API requests
- **Solution**: Wait and try again later

#### "Playback Features Not Working"
- **Cause**: Requires Spotify Premium and special permissions
- **Solution**: Most features work without playback

### Getting Help

1. **Check Sandbox Mode**: Verify features work with demo data
2. **Contact App Owner**: For allowlist requests
3. **Review Documentation**: Check other guides in `/docs`
4. **Report Bugs**: File issues for actual problems

## 📋 FAQ

### Q: Can I use this app with my Spotify account?
A: Yes, but you need to be added to the allowlist by the app owner (up to 25 users total).

### Q: Why do I get errors after logging in?
A: If you're not on the allowlist, you'll get 403 errors. Try sandbox mode instead.

### Q: Can this app be made public for everyone?
A: Not easily. Spotify requires organizations with 250k+ users for unlimited access.

### Q: Is my data safe?
A: Yes, all processing happens in your browser. No data is stored on external servers.

### Q: Do I need Spotify Premium?
A: No, most features work with free Spotify accounts. Only playback features require Premium.

### Q: Can I run my own version?
A: Yes, you can fork the code and create your own Spotify app with your own 25-user limit.

## 🔗 Related Documentation

- [Privacy Architecture](./PRIVACY_ARCHITECTURE.md) - Data handling and privacy
- [Security Guide](./SECURITY.md) - Security measures and best practices
- [API Integration](./API_INTEGRATION.md) - How Spotify API works
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Technical overview

---

*Last updated: January 2025*
*Status: Development Mode (25 user limit)* 