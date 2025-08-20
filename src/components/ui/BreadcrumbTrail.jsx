import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'BarChart3' },
    '/post-creation': { label: 'Criar Post', icon: 'PenTool' },
    '/content-calendar': { label: 'Calendário', icon: 'Calendar' },
    '/media-library': { label: 'Biblioteca', icon: 'Image' },
    '/analytics-dashboard': { label: 'Análises', icon: 'TrendingUp' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Início', path: '/dashboard', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const route = routeMap?.[currentPath];
      if (route) {
        breadcrumbs?.push({
          label: route?.label,
          path: currentPath,
          icon: route?.icon
        });
      }
    });

    return breadcrumbs?.length > 1 ? breadcrumbs : [];
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length === 0) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs?.length - 1;
          const isClickable = !isLast && breadcrumb?.path;

          return (
            <li key={breadcrumb?.path || index} className="flex items-center space-x-2">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className="text-muted-foreground/60" 
                />
              )}
              <div className="flex items-center space-x-1.5">
                {breadcrumb?.icon && (
                  <Icon 
                    name={breadcrumb?.icon} 
                    size={14} 
                    className={isLast ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                )}
                
                {isClickable ? (
                  <button
                    onClick={() => handleBreadcrumbClick(breadcrumb?.path)}
                    className="hover:text-foreground transition-colors duration-150 focus:outline-none focus:text-foreground"
                    aria-label={`Navegar para ${breadcrumb?.label}`}
                  >
                    {breadcrumb?.label}
                  </button>
                ) : (
                  <span 
                    className={`${isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {breadcrumb?.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;