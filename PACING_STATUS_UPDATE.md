# Pacing Status Update

## Changes Made

Updated the projection feature to use a simplified **3-tier pacing status system** based on the pacing index calculation:

### New Pacing Status Logic

```typescript
// Pacing Index Calculation
if (pacingIndex < 85) {
    pacingStatus = 'saving_heavy';
} else if (pacingIndex > 115) {
    pacingStatus = 'spending_fast';
} else {
    pacingStatus = 'on_track';
}
```

### Pacing Status Values

| Status | Pacing Index | Color | Icon | Label |
|--------|-------------|-------|------|-------|
| `saving_heavy` | < 85 | Green | TrendingDown | STATUS: HEALTHY |
| `on_track` | 85 - 115 | Blue | Activity | STATUS: ON TRACK |
| `spending_fast` | > 115 | Red | TrendingUp | STATUS: WARNING |

### Files Updated

1. **`/src/zod/projection-schema.ts`**
   - Updated `pacing_status` enum from 5 values to 3 values
   - Removed: `saving_moderate`, `overspending_moderate`, `overspending_heavy`
   - Kept: `saving_heavy`, `on_track`, `spending_fast`

2. **`/src/components/features/projection/projection-cards.tsx`**
   - Updated `getStatusColor()` function to handle 3 statuses
   - Updated `getPacingIcon()` function with switch statement
   - Removed orange color tier (moderate overspending)

3. **`/src/components/features/projection/projection-insight.tsx`**
   - Updated `getInsightStyle()` function to handle 3 statuses
   - Removed "STATUS: CAUTION" tier
   - Simplified to: HEALTHY → ON TRACK → WARNING

### Visual Changes

- **Green (Healthy)**: Pacing index < 85 - User is spending well below budget pace
- **Blue (On Track)**: Pacing index 85-115 - User is spending at expected pace
- **Red (Warning)**: Pacing index > 115 - User is spending faster than budget allows

### Benefits

✅ Simpler logic - easier to understand  
✅ Clear thresholds - 85 and 115 are intuitive boundaries  
✅ Better UX - 3 states are easier to interpret than 5  
✅ Aligned with backend calculation  
✅ Type-safe with Zod validation  

## API Response Example

```json
{
  "status": "success",
  "insight": {
    "pacing_status": "saving_heavy",  // or "on_track" or "spending_fast"
    "pacing_description": "Spending is very slow compared to days passed.",
    "message": "✅ You are significantly under budget!",
    "is_over_budget_projected": false
  },
  "metrics": {
    "pacing_index": 3  // < 85 = saving_heavy
  }
}
```
