"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, LineChart, Settings, Trophy } from "lucide-react";
import { MARKETS } from "@/lib/constants";

const mainNav = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4">
      <SidebarMenu>
        {mainNav.map((item) => (
          <SidebarMenuItem key={item.name}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.name}
              >
                <item.icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <div className="px-4 text-sm font-medium text-muted-foreground">Markets</div>
      <SidebarMenu>
        {Object.values(MARKETS).map((market) => (
          <SidebarMenuItem key={market.id}>
            <Link href={`/market/${market.id}`}>
              <SidebarMenuButton
                isActive={pathname === `/market/${market.id}`}
                tooltip={market.name}
              >
                <LineChart />
                <span>{market.name}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
