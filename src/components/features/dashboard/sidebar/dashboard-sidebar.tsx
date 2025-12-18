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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
};

export default function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamInfo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
