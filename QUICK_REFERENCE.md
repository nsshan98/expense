# Quick Reference Guide

## 🚀 Running the Application

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## 📍 All Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Main dashboard with overview |
| `/transactions` | All transactions list |
| `/analytics` | Charts and analytics |
| `/budgets` | Budget management |
| `/settings` | Settings page |
| `/auth/login` | Login page |
| `/auth/sign-up` | Sign up page |

## 🔌 API Endpoints Used

```
GET    /transactions
POST   /transactions
GET    /budgets
PATCH  /budgets/:id
GET    /categories
POST   /categories
GET    /merge/suggestions
POST   /merge
GET    /insights
```

## 🎨 Key Components

### Pages (Server Components)
- `app/(dashboard)/*/page.tsx` - All page files

### Interactive (Client Components)
- `DashboardContent` - Dashboard content
- `AnalyticsContent` - Analytics content
- `BudgetManager` - Budget state manager
- `TransactionsList` - Transaction table
- `QuickAddBar` - Add expense form

## 📦 Dependencies

```json
{
  "next": "16.0.8",
  "@tanstack/react-query": "^5.x",
  "axios": "^1.x",
  "recharts": "^3.5.1",
  "sonner": "^2.0.7",
  "lucide-react": "latest"
}
```

## 🛠️ Common Tasks

### Add New API Hook
```typescript
// In src/hooks/use-api.ts
export const useMyData = () => {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/my-endpoint');
      return data;
    },
  });
};
```

### Add New Page
```bash
# Create directory
mkdir -p src/app/\(dashboard\)/my-page

# Create page.tsx (server component)
# Import client components as needed
```

### Add Navigation Link
```typescript
// In src/components/features/dashboard/sidebar/dashboard-sidebar.tsx
{
  title: "My Page",
  url: "/my-page",
  icon: MyIcon,
}
```

## 🎯 Features Status

✅ Dashboard - Complete
✅ Transactions - Complete
✅ Analytics - Complete
✅ Budgets - Complete
✅ Settings - Placeholder
✅ Navigation - Working
✅ API Integration - Complete
✅ Routing - Fixed
✅ Server Components - Implemented
✅ Build - Successful

## 📝 Notes

- All pages are server components
- Interactive features use client components
- React Query handles all data fetching
- Axios client auto-attaches auth tokens
- Toast notifications via Sonner
- Responsive design with Tailwind CSS
