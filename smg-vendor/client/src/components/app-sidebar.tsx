import { Link, useLocation } from "wouter";
import { 
  Users, 
  ArrowLeft,
  LayoutDashboard
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import smgLogo from "../assets/Company_Logo_1765290196442.jpg";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Vendors", url: "/vendors", icon: Users },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar data-testid="sidebar">
      <SidebarHeader className="p-6 flex items-center justify-center border-b border-sidebar-border">
        <img 
          src={smgLogo} 
          alt="SMG Logo" 
          className="h-14 object-contain"
          data-testid="img-smg-logo"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => window.history.back()}
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {navItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url));
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Link href={item.url}>
                        <Icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          SMG Vendor Cloud Portal
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

