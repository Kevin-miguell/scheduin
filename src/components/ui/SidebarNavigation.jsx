import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SidebarNavigation = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'BarChart3',
      tooltip: 'Visão geral e métricas principais'
    },
    {
      label: 'Criar Post',
      path: '/post-creation',
      icon: 'PenTool',
      tooltip: 'Criar novo conteúdo para LinkedIn'
    },
    {
      label: 'Calendário',
      path: '/content-calendar',
      icon: 'Calendar',
      tooltip: 'Gerenciar posts agendados'
    },
    {
      label: 'Biblioteca',
      path: '/media-library',
      icon: 'Image',
      tooltip: 'Gerenciar mídia e assets'
    },
    {
      label: 'Análises',
      path: '/analytics-dashboard',
      icon: 'TrendingUp',
      tooltip: 'Relatórios detalhados de performance'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-60';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:top-16 ${sidebarWidth} bg-card border-r border-border z-900 transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col w-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">ScheduIn</h1>
                  <p className="text-xs text-muted-foreground">LinkedIn Manager</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Icon name="Calendar" size={20} className="text-primary-foreground" />
              </div>
            )}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="h-8 w-8"
              >
                <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
              </Button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems?.map((item) => {
              const isActive = isActivePath(item?.path);
              return (
                <div key={item?.path} className="relative group">
                  <button
                    onClick={() => handleNavigation(item?.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-muted/50 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={20} 
                      className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} 
                    />
                    {!isCollapsed && <span>{item?.label}</span>}
                  </button>
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-1300 elevation-1">
                      {item?.tooltip}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Account Summary */}
          {!isCollapsed && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">João Silva</p>
                  <p className="text-xs text-muted-foreground truncate">3 posts agendados</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-muted-foreground mt-1">Online</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-900 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          {navigationItems?.slice(0, 4)?.map((item) => {
            const isActive = isActivePath(item?.path);
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="text-xs font-medium">{item?.label}</span>
              </button>
            );
          })}
          
          {/* More Menu for Additional Items */}
          <div className="relative">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-150"
            >
              <Icon name="MoreHorizontal" size={20} />
              <span className="text-xs font-medium">Mais</span>
            </button>

            {/* Mobile More Menu */}
            {isMobileOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-popover border border-border rounded-lg elevation-2">
                {navigationItems?.slice(4)?.map((item) => {
                  const isActive = isActivePath(item?.path);
                  return (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-150 hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg ${
                        isActive
                          ? 'text-primary bg-primary/10' :'text-popover-foreground'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-800"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarNavigation;