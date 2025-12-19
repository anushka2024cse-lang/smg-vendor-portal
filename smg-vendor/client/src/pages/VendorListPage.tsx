import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Vendor } from "@shared/schema";

export default function VendorListPage() {
  const [, setLocation] = useLocation();

  const { data: vendors = [], isLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-700 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: "vendorCode" as keyof Vendor,
      header: "Vendor Code",
    },
    {
      key: "companyName" as keyof Vendor,
      header: "Company Name",
      render: (vendor: Vendor) => (
        <span className="font-medium" data-testid={`text-company-${vendor.id}`}>{vendor.companyName}</span>
      ),
    },
    {
      key: "contactPerson" as keyof Vendor,
      header: "Contact Person",
    },
    {
      key: "email" as keyof Vendor,
      header: "Email",
    },
    {
      key: "phone" as keyof Vendor,
      header: "Phone",
    },
    {
      key: "status" as keyof Vendor,
      header: "Status",
      render: (vendor: Vendor) => getStatusBadge(vendor.status),
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: (vendor: Vendor) => setLocation(`/vendors/${vendor.id}`),
      icon: <Eye className="w-4 h-4" />,
    },
    {
      label: "Edit",
      onClick: (vendor: Vendor) => console.log("Edit", vendor),
      icon: <Edit className="w-4 h-4" />,
    },
    {
      label: "Delete",
      onClick: (vendor: Vendor) => console.log("Delete", vendor),
      icon: <Trash2 className="w-4 h-4" />,
    },
  ];

  const filterOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          title="Vendors"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Vendors" },
          ]}
        />
        <main className="flex-1 p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Vendors"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Vendors" },
        ]}
        actions={
          <Button data-testid="button-add-vendor">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        }
      />
      <main className="flex-1 p-8">
        <DataTable
          data={vendors}
          columns={columns}
          actions={actions}
          searchPlaceholder="Search vendors..."
          searchKeys={["companyName", "contactPerson", "email", "vendorCode"]}
          filterOptions={filterOptions}
          filterKey="status"
          onRowClick={(vendor) => setLocation(`/vendors/${vendor.id}`)}
        />
      </main>
    </div>
  );
}
