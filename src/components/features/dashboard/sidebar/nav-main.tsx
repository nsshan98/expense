"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/atoms/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/atoms/sidebar";

export default function NavMain({
  items,
}: {
  items: {
    title: string;
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      {items.map((group, index) => (
        <Fragment key={index}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item, index) => {
              // Check if main item is active (exact match or parent of current path if valid)
              // Ideally for dashboard just verify exact or sub-paths if strictly structured.
              // For simplicity: exact match for now, or if it has subitems check if any subitem matches.
              const isActive = pathname === item.url;
              const hasActiveSubItem = item.items?.some(
                (sub) => pathname === sub.url
              );

              return (
                <Collapsible
                  key={index}
                  asChild
                  defaultOpen={item.isActive || isActive || hasActiveSubItem}
                  className="group/collapsible"
                >
                  <SidebarMenuItem className="last-of-type:mb-5">
                    {item.items ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link
                                    href={subItem.url}
                                    onClick={handleLinkClick}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        tooltip={item.title}
                        asChild
                        isActive={isActive}
                      >
                        <Link href={item.url} onClick={handleLinkClick}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </Fragment>
      ))}
    </SidebarGroup>
  );
}
