import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "./FileUpload";
import { FileText, Image } from "lucide-react";

interface LegalComplianceSectionProps {
  ndaFile?: { name: string; size: string } | null;
  trademarkFile?: { name: string; size: string } | null;
  onNDAUpload: (file: File) => void;
  onTrademarkUpload: (file: File) => void;
  onNDARemove?: () => void;
  onTrademarkRemove?: () => void;
  isNDAUploading?: boolean;
  isTrademarkUploading?: boolean;
  ndaProgress?: number;
  trademarkProgress?: number;
}

export function LegalComplianceSection({
  ndaFile,
  trademarkFile,
  onNDAUpload,
  onTrademarkUpload,
  onNDARemove,
  onTrademarkRemove,
  isNDAUploading,
  isTrademarkUploading,
  ndaProgress,
  trademarkProgress,
}: LegalComplianceSectionProps) {
  return (
    <Card data-testid="card-legal-compliance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Legal Compliance Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Non-Disclosure Agreement
              </span>
            </div>
            <FileUpload
              title="NDA Document"
              description="Upload signed NDA document"
              acceptedTypes={["application/pdf"]}
              maxSize={10}
              onFileSelect={onNDAUpload}
              onFileRemove={onNDARemove}
              uploadedFile={ndaFile}
              isUploading={isNDAUploading}
              uploadProgress={ndaProgress}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Dedicated Trademark
              </span>
            </div>
            <FileUpload
              title="Trademark Document"
              description="Upload trademark certificate or logo"
              acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
              maxSize={10}
              onFileSelect={onTrademarkUpload}
              onFileRemove={onTrademarkRemove}
              uploadedFile={trademarkFile}
              isUploading={isTrademarkUploading}
              uploadProgress={trademarkProgress}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
