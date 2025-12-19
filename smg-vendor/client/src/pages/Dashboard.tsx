import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, ArrowRight, ShoppingCart } from "lucide-react";

const stats = [
  {
    title: "Total Vendors",
    value: "24",
    description: "Active vendor partnerships",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Purchase Orders",
    value: "156",
    description: "This month",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Pending Documents",
    value: "8",
    description: "Awaiting approval",
    icon: FileText,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Components",
    value: "342",
    description: "Active components",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

const quickActions = [
  {
    title: "View Vendors",
    description: "Manage vendor list and details",
    href: "/vendors",
    icon: Users,
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Dashboard"
        breadcrumbs={[{ label: "Home" }]}
      />

      <main className="flex-1 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} href={action.href}>
                    <div
                      className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer transition-colors"
                      data-testid={`action-${action.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{action.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card data-testid="card-recent-activity">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest vendor updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-border">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground" data-testid="text-activity-1">
                      New vendor onboarded
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ABC Electronics Ltd. - 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-border">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground" data-testid="text-activity-2">
                      PO Created
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PO-2024-156 for Motors - 5 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground" data-testid="text-activity-3">
                      Document Pending
                    </p>
                    <p className="text-xs text-muted-foreground">
                      NDA awaiting signature - 1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
