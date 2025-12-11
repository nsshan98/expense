"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/atoms/sidebar";

export default function TeamInfo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-auto size-8 font-baumans text-2xl items-center justify-center rounded-md">
            T
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="truncate font-baumans font-medium text-xl">
              {"Test"}
            </p>
            <span className="truncate text-xs">{"Premium"}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
