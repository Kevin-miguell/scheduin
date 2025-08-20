import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';

const GlobalHeader = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Post publicado com sucesso',
      message: 'Seu post foi publicado no LinkedIn',
      time: '2 min atrás',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Post agendado',
      message: 'Seu post será publicado em 1 hora',
      time: '15 min atrás',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Relatório disponível',
      message: 'Seu relatório mensal está pronto',
      time: '1 hora atrás',
      read: true
    }
  ]);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-primary';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Mobile menu trigger (hidden on desktop) */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Icon name="Menu" size={20} />
          </Button>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Buscar posts, análises..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* LinkedIn Connection Status */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-success/10 text-success rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">LinkedIn Conectado</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg elevation-2 z-1100">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors duration-150 ${
                        !notification?.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon
                          name={getNotificationIcon(notification?.type)}
                          size={16}
                          className={`mt-0.5 ${getNotificationColor(notification?.type)}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-popover-foreground">
                            {notification?.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification?.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification?.time}
                          </p>
                        </div>
                        {!notification?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver todas as notificações
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={handleProfileClick}
              className="flex items-center space-x-2 px-2"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
                JD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">João Silva</p>
                <p className="text-xs text-muted-foreground">Marketing Manager</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-popover border border-border rounded-lg elevation-2 z-1100">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                      JD
                    </div>
                    <div>
                      <p className="font-medium text-popover-foreground">João Silva</p>
                      <p className="text-sm text-muted-foreground">Marketing Manager</p>
                      <p className="text-xs text-muted-foreground">joao@empresa.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 transition-colors duration-150"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Configurações</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 transition-colors duration-150">
                    <Icon name="HelpCircle" size={16} />
                    <span>Ajuda e Suporte</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 transition-colors duration-150">
                    <Icon name="User" size={16} />
                    <span>Meu Perfil</span>
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;