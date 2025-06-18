# Spotify Insights Documentation

Welcome to the Spotify Insights documentation! This folder contains comprehensive documentation for understanding, maintaining, and extending the application.

## 📚 Documentation Files

### 📊 [METRIC_CALCULATIONS.md](./METRIC_CALCULATIONS.md)
**Comprehensive metric calculation documentation**
- Detailed explanations of all metric formulas
- Data sources and API endpoints
- Processing pipeline documentation
- Maintenance guidelines and best practices
- **Use this when**: You need to understand how any metric is calculated, modify existing calculations, or add new metrics

### ⚡ [METRICS_QUICK_REFERENCE.md](./METRICS_QUICK_REFERENCE.md)
**Quick lookup guide for developers**
- Concise formula tables for all metrics
- Common patterns and coding standards
- Time range mappings and mood categories
- **Use this when**: You need a quick lookup while coding or debugging

## 🎯 Key Concepts

### Data Flow Overview
```
Spotify API → Data Fetching → Processing → Enhancement → UI Display
     ↓              ↓             ↓            ↓           ↓
  Raw Data    useSpotifyData   useMemo()   Calculations  Components
```

### Metric Categories
- **🎤 Artist Metrics**: Track count, listening hours, song share, popularity, etc.
- **🎵 Track Metrics**: Listening time, plays, audio features, mood scores, etc.
- **🎭 Genre Metrics**: Count, percentage, diversity, replay value, etc.
- **📈 Listening Trends**: Weekly patterns, mood analysis, seasonal variations
- **📊 Overview Stats**: Totals, averages, recent activity summaries

### Important Distinctions
- **Listening Hours** = Potential time (if all tracks played once)
- **Play Counts** = Estimated based on ranking algorithms
- **Freshness/Discovery** = Simulated for demonstration purposes
- **All calculations** include minimum value protection

## 🔧 For Developers

### Before Making Changes
1. Review the relevant documentation section
2. Understand the calculation logic and dependencies
3. Consider impact on other components
4. Test with edge cases (empty data, large datasets)
5. Update documentation if adding new metrics

### Common Tasks
- **Adding new metrics**: See METRIC_CALCULATIONS.md → Maintenance Notes
- **Debugging calculations**: Use METRICS_QUICK_REFERENCE.md for formulas
- **Understanding data flow**: Review Data Processing Pipeline section
- **Modifying time ranges**: Check Time Range Handling section

### Code Standards
- Always use `Math.max()` for minimum value protection
- Include fallback values for missing data: `value || defaultValue`
- Use consistent rounding: `Math.round()` for scores, `Math.round(n*100)/100` for decimals
- Validate inputs before processing: `if (!data.length) return [];`

## 🎵 Understanding the Data

### Spotify API Limitations
- **Top Tracks/Artists**: Maximum 2000 items per request
- **Recently Played**: Maximum 50 tracks
- **Time Ranges**: Only 3 options (short_term, medium_term, long_term)
- **Audio Features**: Separate API calls required

### Calculated vs Real Data
| Type | Source | Accuracy |
|------|--------|----------|
| Track Count | Real | ✅ Accurate |
| Artist Popularity | Real | ✅ Accurate |
| Audio Features | Real | ✅ Accurate |
| Listening Hours | Calculated | ⚠️ Potential time |
| Play Counts | Estimated | ⚠️ Algorithm-based |
| Discovery Dates | Simulated | ❌ Demo purposes |

## 📈 Performance Notes

### Optimization Strategies
- Use `useMemo()` for expensive calculations
- Limit processing to visible/relevant data
- Cache results when possible
- Avoid recalculating on every render

### Memory Considerations
- Large datasets (2000+ items) can impact performance
- Consider pagination for UI display
- Clean up unused data references
- Monitor component re-renders

## 🆘 Troubleshooting

### Common Issues
1. **Negative values**: Check minimum value constraints
2. **NaN results**: Verify division by zero protection
3. **Missing data**: Ensure fallback values are set
4. **Performance issues**: Review useMemo dependencies
5. **Inconsistent results**: Check time range mapping

### Debug Checklist
- [ ] Data is properly loaded before processing
- [ ] All required fields exist in data objects
- [ ] Calculations include minimum/maximum bounds
- [ ] Time range mapping is correct
- [ ] useMemo dependencies are accurate

---

## 🔄 Keeping Documentation Updated

When making changes to metric calculations:

1. **Update METRIC_CALCULATIONS.md** with detailed explanations
2. **Update METRICS_QUICK_REFERENCE.md** with formula changes
3. **Add examples** for complex calculations
4. **Document any new dependencies** or data requirements
5. **Update version numbers** and last updated dates

---

*Documentation maintained by the Spotify Insights development team*
*Last updated: December 2024* 