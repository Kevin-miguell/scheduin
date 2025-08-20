import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActionItems = [
    {
      title: "Criar Novo Post",
      description: "Comece a criar conteúdo agora",
      icon: "PenTool",
      color: "bg-primary text-primary-foreground",
      action: () => navigate('/post-creation'),
      shortcut: "Ctrl + N"
    },
    {
      title: "Ver Calendário",
      description: "Gerencie posts agendados",
      icon: "Calendar",
      color: "bg-secondary text-secondary-foreground", 
      action: () => navigate('/content-calendar'),
      shortcut: "Ctrl + C"
    },
    {
      title: "Biblioteca de Mídia",
      description: "Organize seus assets",
      icon: "Image",
      color: "bg-accent text-accent-foreground",
      action: () => navigate('/media-library'),
      shortcut: "Ctrl + M"
    },
    {
      title: "Relatórios",
      description: "Análise detalhada de performance",
      icon: "BarChart3",
      color: "bg-warning text-warning-foreground",
      action: () => navigate('/analytics-dashboard'),
      shortcut: "Ctrl + R"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
          <p className="text-sm text-muted-foreground">Acesso direto às principais funcionalidades</p>
        </div>
        <Icon name="Zap" size={20} className="text-warning" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActionItems?.map((item, index) => (
          <button
            key={index}
            onClick={item?.action}
            className="group flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-150 text-left"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item?.color} group-hover:scale-105 transition-transform duration-150`}>
              <Icon name={item?.icon} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150">
                {item?.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {item?.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {item?.shortcut}
                </span>
                <Icon name="ArrowRight" size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-150" />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Use os atalhos do teclado para navegação rápida
          </div>
          <Button variant="ghost" size="sm" iconName="Keyboard" iconPosition="left">
            Ver Todos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;