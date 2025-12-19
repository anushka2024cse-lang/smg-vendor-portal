import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Eye, Edit } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { VendorInfoSection } from "@/components/vendor/VendorInfoSection";
import { LegalComplianceSection } from "@/components/vendor/LegalComplianceSection";
import { ComponentHistory } from "@/components/vendor/ComponentHistory";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Vendor, Component, ComponentHistory as ComponentHistoryType } from "@shared/schema";

export default function VendorDetailPage() {
  const [, params] = useRoute("/vendors/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const vendorId = params?.id;

  const { data: vendor, isLoading: vendorLoading } = useQuery<Vendor>({
    queryKey: ["/api/vendors", vendorId],
    enabled: !!vendorId,
  });

  const { data: components = [] } = useQuery<Component[]>({
    queryKey: ["/api/vendors", vendorId, "components"],
    enabled: !!vendorId,
  });

  const { data: history = [] } = useQuery<ComponentHistoryType[]>({
    queryKey: ["/api/vendors", vendorId, "history"],
    enabled: !!vendorId,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: "nda" | "trademark" }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      const response = await fetch(`/api/vendors/${vendorId}/documents`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Document uploaded",
        description: `${variables.type === "nda" ? "NDA" : "Trademark"} document uploaded successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vendors", vendorId] });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const componentColumns = [
    {
      key: "componentName" as keyof Component,
      header: "Component Name",
      render: (component: Component) => (
        <span className="font-medium" data-testid={`text-component-${component.id}`}>{component.componentName}</span>
      ),
    },
    {
      key: "category" as keyof Component,
      header: "Category",
      render: (component: Component) => (
        <Badge variant="outline" data-testid={`badge-category-${component.id}`}>{component.category}</Badge>
      ),
    },
    {
      key: "sorNumber" as keyof Component,
      header: "SOR Number",
    },
    {
      key: "status" as keyof Component,
      header: "Status",
      render: (component: Component) => {
        switch (component.status.toLowerCase()) {
          case "active":
            return <Badge className="bg-green-500/10 text-green-700 border-green-200" data-testid={`status-${component.id}`}>Active</Badge>;
          case "inactive":
            return <Badge variant="secondary" data-testid={`status-${component.id}`}>Inactive</Badge>;
          default:
            return <Badge variant="outline" data-testid={`status-${component.id}`}>{component.status}</Badge>;
        }
      },
    },
  ];

  const componentActions = [
    {
      label: "View SOR",
      onClick: (component: Component) => console.log("View SOR", component),
      icon: <Eye className="w-4 h-4" />,
    },
    {
      label: "Edit",
      onClick: (component: Component) => console.log("Edit", component),
      icon: <Edit className="w-4 h-4" />,
    },
  ];

  if (vendorLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          title="Loading..."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Vendors", href: "/vendors" },
            { label: "Loading..." },
          ]}
        />
        <main className="flex-1 p-8 space-y-6">
          <Skeleton className="h-10 w-[200px]" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </main>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          title="Vendor Not Found"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Vendors", href: "/vendors" },
            { label: "Not Found" },
          ]}
        />
        <main className="flex-1 p-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-not-found">The requested vendor could not be found.</p>
            <Button
              variant="outline"
              onClick={() => setLocation("/vendors")}
              className="mt-4"
              data-testid="button-back-to-vendors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vendors
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const ndaFile = vendor.ndaUploaded && vendor.ndaFileName
    ? { name: vendor.ndaFileName, size: "PDF Document" }
    : null;

  const trademarkFile = vendor.trademarkUploaded && vendor.trademarkFileName
    ? { name: vendor.trademarkFileName, size: "Document" }
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={vendor.companyName}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Vendors", href: "/vendors" },
          { label: vendor.companyName },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setLocation("/vendors")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button data-testid="button-edit-vendor">
              <Edit className="w-4 h-4 mr-2" />
              Edit Vendor
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4" data-testid="vendor-tabs">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="components" data-testid="tab-components">Components</TabsTrigger>
            <TabsTrigger value="documents" data-testid="tab-documents">Documents</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <VendorInfoSection vendor={vendor} />
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <DataTable
              data={components}
              columns={componentColumns}
              actions={componentActions}
              searchPlaceholder="Search components..."
              searchKeys={["componentName", "category", "sorNumber"]}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <LegalComplianceSection
              ndaFile={ndaFile}
              trademarkFile={trademarkFile}
              onNDAUpload={(file) => uploadMutation.mutate({ file, type: "nda" })}
              onTrademarkUpload={(file) => uploadMutation.mutate({ file, type: "trademark" })}
              isNDAUploading={uploadMutation.isPending}
              isTrademarkUploading={uploadMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <ComponentHistory history={history} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
