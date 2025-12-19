import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Mail, Phone, MapPin, CreditCard, Landmark } from "lucide-react";
import type { Vendor } from "@shared/schema";

interface VendorInfoSectionProps {
  vendor: Vendor;
}

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      {icon && <span className="text-muted-foreground mt-0.5">{icon}</span>}
      <div className="flex-1 grid grid-cols-2 gap-4">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="text-sm text-foreground">{value || "N/A"}</span>
      </div>
    </div>
  );
}

export function VendorInfoSection({ vendor }: VendorInfoSectionProps) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card data-testid="card-company-info">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Information
          </CardTitle>
          {getStatusBadge(vendor.status)}
        </CardHeader>
        <CardContent className="space-y-1">
          <InfoRow label="Vendor Code" value={vendor.vendorCode} />
          <InfoRow label="Company Name" value={vendor.companyName} icon={<Building2 className="w-4 h-4" />} />
          <InfoRow label="Contact Person" value={vendor.contactPerson} icon={<User className="w-4 h-4" />} />
          <InfoRow label="Email" value={vendor.email} icon={<Mail className="w-4 h-4" />} />
          <InfoRow label="Phone" value={vendor.phone} icon={<Phone className="w-4 h-4" />} />
        </CardContent>
      </Card>

      <Card data-testid="card-address-info">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <InfoRow label="Address" value={vendor.address} />
          <InfoRow label="City" value={vendor.city} />
          <InfoRow label="State" value={vendor.state} />
          <InfoRow label="Pincode" value={vendor.pincode} />
          <InfoRow label="GST Number" value={vendor.gstNumber} icon={<CreditCard className="w-4 h-4" />} />
          <InfoRow label="PAN Number" value={vendor.panNumber} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2" data-testid="card-bank-info">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Landmark className="w-5 h-5" />
            Banking Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoRow label="Bank Name" value={vendor.bankName} />
            <InfoRow label="Account Number" value={vendor.accountNumber} />
            <InfoRow label="IFSC Code" value={vendor.ifscCode} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
