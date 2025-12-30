# Projection Feature Implementation

## Overview
The **Projection** feature provides end-of-month spending projections and budget analysis for users. It displays comprehensive insights about spending patterns, budget health, and financial projections.

## Files Created

### 1. **Schema & Types**
- **`/src/zod/projection-schema.ts`** - Zod validation schema for projection API response
- **`/src/types/projection.ts`** - TypeScript type definitions (re-exports from Zod schema)

### 2. **Hooks**
- **`/src/hooks/use-projection.ts`** - React Query hook for fetching projection data
  - Auto-refetches every 5 minutes
  - Validates response with Zod schema
  - Maintains previous data while refetching

### 3. **Components**
- **`/src/components/features/projection/projection-cards.tsx`** - 6 metric cards displaying:
  1. Budget Overview (combined Total Budget + Current Spend)
  2. Projected Total
  3. Projected Savings
  4. Safe Daily Spend
  5. Pacing Index
  6. Projected Overspend
  
- **`/src/components/features/projection/projection-insight.tsx`** - Insight banner with:
  - Dynamic status indicator (Healthy/On Track/Caution/Warning)
  - Main insight message
  - Pacing description
  - Period information
  
- **`/src/components/features/projection/empty-projection-state.tsx`** - Empty state when no data available:
  - Clear messaging
  - Helpful reasons list
  - Action buttons (Refresh Data, Set Up Budgets)

### 4. **Pages**
- **`/src/app/(dashboard)/projection/page.tsx`** - Main projection page with:
  - Loading states
  - Error handling
  - Empty state handling
  - Period information display

### 5. **Navigation**
- Updated **`/src/components/features/dashboard/sidebar/dashboard-sidebar.tsx`** to include Projection menu item

## API Response Structure

```typescript
{
  "status": "success",
  "period": {
    "current_date": "30-12-2025",
    "days_remaining": 1
  },
  "metrics": {
    "current_spend": 1245,
    "projected_total": 1286.5,
    "total_budget": 45500,
    "projected_savings": 44213.5,
    "projected_overspend": 0,
    "pacing_index": 3,
    "safe_daily_spend": 44255,
    "currency": "AED"  // Dynamic based on user preference
  },
  "insight": {
    "message": "✅ You are significantly under budget! You have a buffer of د.إ44,214.",
    "pacing_status": "saving_heavy",
    "pacing_description": "Spending is very slow compared to days passed.",
    "is_over_budget_projected": false
  }
}
```

## Features

### Dynamic Currency Support
- Uses `useCurrency` hook from `CurrencyContext`
- Automatically formats amounts with user's preferred currency
- Currency symbol and code are fetched from user preferences

### Pacing Status Types
- `saving_heavy` - Significantly under budget (Green)
- `saving_moderate` - Moderately under budget (Green)
- `on_track` - Spending as expected (Blue)
- `overspending_moderate` - Slightly over budget (Orange)
- `overspending_heavy` - Significantly over budget (Red)

### Visual Indicators
- Color-coded cards based on pacing status
- Progress bars for budget utilization
- Dynamic icons based on financial health
- Border highlighting for important metrics

### States Handled
1. **Loading** - Skeleton loaders for all components
2. **Error** - Error card with retry option
3. **Empty** - Helpful empty state with action buttons
4. **Success** - Full projection display with all metrics

## Route
- **URL**: `/projection`
- **Navigation**: Accessible from sidebar between "Analytics" and "Budgets"
- **Icon**: TrendingUp (Lucide React)

## Key Design Decisions

1. **Combined Budget Card**: Total Budget and Current Spend are shown in a single card to save space and show relationship
2. **No "Create New Projection" Card**: Removed as per requirements - projections are auto-calculated
3. **6 Cards Total**: Exactly 6 metric cards as specified
4. **Zod Validation**: All API responses are validated for type safety
5. **Responsive Grid**: Cards adapt to screen size (1 col mobile, 2 cols tablet, 3 cols desktop)

## Usage

### Accessing the Page
Navigate to `/projection` or click "Projection" in the sidebar.

### API Endpoint
The hook expects a `GET /projection` endpoint that returns the structure defined in the Zod schema.

### Customization
- Modify `projection-schema.ts` to adjust validation rules
- Update `projection-cards.tsx` to change card layouts
- Customize colors in `projection-insight.tsx` for different pacing statuses

## Dependencies
- React Query (`@tanstack/react-query`)
- Zod (`zod`)
- Lucide React (`lucide-react`)
- Existing UI components (Card, Button, Skeleton)
- Currency Context (`useCurrency`)

## Future Enhancements
- Historical projection comparison
- Export projection data
- Projection trends over multiple months
- Customizable projection parameters
- Email alerts for budget warnings
