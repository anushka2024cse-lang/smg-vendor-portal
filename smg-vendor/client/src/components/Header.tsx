import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function Header({ title, breadcrumbs, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border" data-testid="page-header">
      <div className="flex items-center justify-between h-16 px-8">
        <div className="flex flex-col gap-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-sm" data-testid="breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  {crumb.href ? (
                    <Link href={crumb.href}>
                      <span 
                        className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                        data-testid={`breadcrumb-${crumb.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {crumb.label}
                      </span>
                    </Link>
                  ) : (
                    <span 
                      className="font-medium text-foreground"
                      data-testid={`breadcrumb-${crumb.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
            {title}
          </h1>
        </div>
        {actions && (
          <div className="flex items-center gap-3" data-testid="header-actions">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
