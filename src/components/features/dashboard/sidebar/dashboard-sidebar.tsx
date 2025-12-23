"use client";

import {
  SquareTerminal,
  ChartColumnBig,
  Settings2,
  Receipt,
  Wallet,
  CreditCard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/atoms/sidebar";
import NavMain from "./nav-main";
import NavUser from "./nav-user";
import TeamInfo from "./team-info";
import { SubscriptionBanner } from "./subscription-banner";

// This is sample data structure
const navMainData = [
  {
    title: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: Receipt,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: ChartColumnBig,
      },
      {
        title: "Budgets",
        url: "/budgets",
        icon: Wallet,
      },
      {
        title: "Subscription",
        url: "/subscription",
        icon: CreditCard,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
  },
];

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function DashboardSidebar({
  user,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamInfo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
        <div className="mt-auto" />
        <SubscriptionBanner />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar || "/avatars/shadcn.jpg"
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
