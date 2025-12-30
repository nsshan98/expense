import { ThemeProvider } from "@/lib/theme-provider";
import { ReactNode } from "react";
import "@/styles/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/atoms/sidebar";
import DashboardSidebar from "@/components/features/dashboard/sidebar/dashboard-sidebar";
import DashboardHeader from "@/components/features/dashboard/sidebar/dashboard-header";
import { Baumans, Plus_Jakarta_Sans } from "next/font/google";
import { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getCurrentUser } from "@/services/user";
import { CurrencyProvider } from "@/contexts/currency-context";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const baumans = Baumans({
  variable: "--font-baumans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker",
};

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  const apiUser = await getCurrentUser();

  // Prioritize API data, fall back to session data, then default
  const user = apiUser ? {
    name: apiUser.name,
    email: apiUser.email,
    avatar: "/avatars/shadcn.jpg"
  } : (session?.user ? {
    name: session.user.name,
    email: session.user.email || "user@example.com",
    avatar: "/avatars/shadcn.jpg"
  } : {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg"
  });

  // Get currency info from API user or default to BDT
  const currencySymbol = apiUser?.currencySymbol || "৳";
  const currencyCode = apiUser?.currency || "BDT";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${baumans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider currencySymbol={currencySymbol} currencyCode={currencyCode}>
            <SidebarProvider>
              <DashboardSidebar user={user} />
              <SidebarInset>
                <DashboardHeader />

                {/* Page content */}
                <main className="flex-1 p-4">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
