import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Wrench, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ComponentHistory as ComponentHistoryType } from "@shared/schema";

interface ComponentHistoryProps {
  history: ComponentHistoryType[];
}

export function ComponentHistory({ history }: ComponentHistoryProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toolHistory = history.filter((item) => item.tool && item.tool.trim() !== "");
  const allotmentHistory = history.filter((item) => item.allotment && item.allotment.trim() !== "");

  return (
    <Card data-testid="card-component-history">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Component History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No component history available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Wrench className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Tool History</h4>
              </div>
              <div className="space-y-3">
                {toolHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No tool history available</p>
                ) : (
                  toolHistory.map((item) => (
                    <div
                      key={`tool-${item.id}`}
                      className="flex items-start justify-between p-3 rounded-lg bg-muted/30 border border-border"
                      data-testid={`tool-history-${item.id}`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.tool}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.date)}
                        </p>
                        {item.remarks && (
                          <p className="text-xs text-muted-foreground">{item.remarks}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Tool
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Package className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Allotment History</h4>
              </div>
              <div className="space-y-3">
                {allotmentHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No allotment history available</p>
                ) : (
                  allotmentHistory.map((item) => (
                    <div
                      key={`allotment-${item.id}`}
                      className="flex items-start justify-between p-3 rounded-lg bg-muted/30 border border-border"
                      data-testid={`allotment-history-${item.id}`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.allotment}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.date)}
                        </p>
                        {item.remarks && (
                          <p className="text-xs text-muted-foreground">{item.remarks}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Allotment
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
