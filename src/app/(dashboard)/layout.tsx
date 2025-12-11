import { ThemeProvider } from "@/lib/theme-provider";
import { ReactNode } from "react";
import "@/styles/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/atoms/sidebar";
import DashboardSidebar from "@/components/features/dashboard/sidebar/dashboard-sidebar";
import DashboardHeader from "@/components/features/dashboard/sidebar/dashboard-header";
import { Baumans, Plus_Jakarta_Sans } from "next/font/google";
import { Metadata } from "next";
import { getSession } from "@/lib/session";

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
  title: "Protocol Admin Panel",
  description: "Protocol Admin Panel",
};

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  console.log(session);
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
          <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
              <DashboardHeader />

              {/* Page content */}
              <main className="flex-1 p-4">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
