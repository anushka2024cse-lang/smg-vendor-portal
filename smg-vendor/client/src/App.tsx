import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/Dashboard";
import VendorListPage from "@/pages/VendorListPage";
import VendorDetailPage from "@/pages/VendorDetailPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/vendors" component={VendorListPage} />
      <Route path="/vendors/:id" component={VendorDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "280px",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-2 bg-background border-b border-border md:hidden">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <span className="text-sm font-medium">SMG Portal</span>
              </div>
              <main className="flex-1">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
