import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  icon?: React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filterOptions?: { label: string; value: string }[];
  filterKey?: keyof T;
  onRowClick?: (item: T) => void;
  itemsPerPage?: number;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filterOptions,
  filterKey,
  onRowClick,
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((item) => {
    const matchesSearch = searchKeys.length === 0 || searchKeys.some((key) => {
      const value = item[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });

    const matchesFilter = !filterKey || filterValue === "all" || 
      String(item[filterKey]).toLowerCase() === filterValue.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getValue = (item: T, key: keyof T | string): unknown => {
    if (typeof key === "string" && key.includes(".")) {
      const keys = key.split(".");
      let value: unknown = item;
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      return value;
    }
    return item[key as keyof T];
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        {filterOptions && (
          <Select
            value={filterValue}
            onValueChange={(value) => {
              setFilterValue(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]" data-testid="select-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground py-4 px-6"
                  >
                    {column.header}
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground py-4 px-6">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/30"
                    } ${onRowClick ? "cursor-pointer hover-elevate" : ""}`}
                    onClick={() => onRowClick?.(item)}
                    data-testid={`row-item-${item.id}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="py-4 px-6 text-sm text-foreground"
                      >
                        {column.render
                          ? column.render(item)
                          : String(getValue(item, column.key) ?? "")}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`button-actions-${item.id}`}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action) => (
                              <DropdownMenuItem
                                key={action.label}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(item);
                                }}
                                data-testid={`action-${action.label.toLowerCase().replace(/\s+/g, "-")}-${item.id}`}
                              >
                                {action.icon && (
                                  <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
