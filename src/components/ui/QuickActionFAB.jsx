import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionFAB = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      label: 'Criar Post',
      path: '/post-creation',
      icon: 'PenTool',
      color: 'bg-primary text-primary-foreground',
      description: 'Novo conteúdo'
    },
    {
      label: 'Agendar',
      path: '/content-calendar',
      icon: 'Calendar',
      color: 'bg-secondary text-secondary-foreground',
      description: 'Calendário'
    },
    {
      label: 'Biblioteca',
      path: '/media-library',
      icon: 'Image',
      color: 'bg-accent text-accent-foreground',
      description: 'Mídia'
    }
  ];

  const handleActionClick = (path) => {
    navigate(path);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="lg:hidden fixed bottom-20 right-4 z-1000">
      {/* Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-subtle -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
      {/* Quick Action Buttons */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-slide-up">
          {quickActions?.map((action, index) => (
            <div
              key={action?.path}
              className="flex items-center space-x-3 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-card px-3 py-2 rounded-lg elevation-1 text-sm font-medium text-foreground whitespace-nowrap">
                {action?.description}
              </div>
              <button
                onClick={() => handleActionClick(action?.path)}
                className={`w-12 h-12 ${action?.color} rounded-full elevation-2 hover:elevation-drag transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center`}
                aria-label={action?.label}
              >
                <Icon name={action?.icon} size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Main FAB */}
      <Button
        onClick={toggleExpanded}
        className={`w-14 h-14 rounded-full elevation-2 hover:elevation-drag transition-all duration-300 ${
          isExpanded 
            ? 'bg-destructive text-destructive-foreground rotate-45' 
            : 'bg-primary text-primary-foreground hover:scale-105'
        } active:scale-95`}
        aria-label={isExpanded ? 'Fechar menu' : 'Ações rápidas'}
      >
        <Icon 
          name={isExpanded ? 'X' : 'Plus'} 
          size={24} 
          className="transition-transform duration-300"
        />
      </Button>
      {/* Pulse Animation for Attention */}
      {!isExpanded && (
        <div className="absolute inset-0 w-14 h-14 bg-primary/30 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default QuickActionFAB;