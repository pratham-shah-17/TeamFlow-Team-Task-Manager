import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [] }) => {
  const location = useLocation();

  const getAutoItems = (): BreadcrumbItem[] => {
    const parts = location.pathname.split('/').filter(Boolean);
    const autoItems: BreadcrumbItem[] = [];

    parts.forEach((part, index) => {
      const path = '/' + parts.slice(0, index + 1).join('/');
      autoItems.push({
        label: part.charAt(0).toUpperCase() + part.slice(1),
        path: index < parts.length - 1 ? path : undefined,
      });
    });

    return autoItems;
  };

  const breadcrumbs = items.length > 0 ? items : getAutoItems();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
      <Link to="/dashboard" className="hover:text-white transition-colors">
        <Home size={14} />
      </Link>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-slate-600" />
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-white transition-colors text-slate-400"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
