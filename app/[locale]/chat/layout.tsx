"use client";

import { Kbd } from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useStore as useStoreApp } from "@/hooks/use-store-app";
import { differenceInMilliseconds, format } from "date-fns";
import { PlusIcon, SunMoonIcon } from "lucide-react";
import Link from "next/link";

function ChatSidebar() {
  const storeApp = useStoreApp();

  return (
    <Sidebar key={storeApp.chatStep}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              ref={(instance) => {
                const newLocal = (e: KeyboardEvent) => {
                  if (e.code === "KeyO" && e.ctrlKey && e.shiftKey) {
                    e.preventDefault();
                    instance?.click();
                  }
                };
                window.addEventListener("keydown", newLocal);
                return () => {
                  window.removeEventListener("keydown", newLocal);
                };
              }}
            >
              <Link href={`/chat/${"new"}`}>
                <PlusIcon></PlusIcon>
                {`/chat/${"new"}`}
                <Kbd className="ml-auto">{"ctrl"}</Kbd>
                <Kbd>{"shift"}</Kbd>
                <Kbd>{"o"}</Kbd>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel></SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.values(storeApp.chats)
                .sort((a, b) => {
                  return differenceInMilliseconds(b.updated_at, a.updated_at);
                })
                .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/chat/${item.id}`}>
                        {format(item.updated_at, "Pp")}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SidebarGroup></SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              ref={() => {
                const isDark = JSON.parse(
                  window.localStorage.getItem("dark") || "false",
                );
                if (isDark) {
                  window.document.documentElement.classList.toggle(
                    "dark",
                    true,
                  );
                }
              }}
              onClick={() => {
                window.localStorage.setItem(
                  "dark",
                  JSON.stringify(
                    window.document.documentElement.classList.toggle("dark"),
                  ),
                );
              }}
            >
              <SunMoonIcon></SunMoonIcon>
              {".dark"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function Layout({ children }: LayoutProps<"/[locale]/chat">) {
  return (
    <SidebarProvider>
      <ChatSidebar></ChatSidebar>
      {children}
    </SidebarProvider>
  );
}
