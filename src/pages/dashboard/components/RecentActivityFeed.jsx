import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'published',
      title: "Como aumentar a produtividade no trabalho remoto",
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      engagement: { likes: 23, comments: 7, shares: 4 },
      status: 'success'
    },
    {
      id: 2,
      type: 'scheduled',
      title: "Tendências do mercado digital para 2025",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      scheduledFor: new Date(Date.now() + 7200000), // 2 hours from now
      status: 'pending'
    },
    {
      id: 3,
      type: 'published',
      title: "Estratégias de networking para profissionais",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      engagement: { likes: 45, comments: 12, shares: 8 },
      status: 'success'
    },
    {
      id: 4,
      type: 'failed',
      title: "Análise de dados: ferramentas essenciais",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      error: "Erro de conexão com LinkedIn API",
      status: 'error'
    },
    {
      id: 5,
      type: 'published',
      title: "Dicas para apresentações impactantes",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      engagement: { likes: 67, comments: 19, shares: 15 },
      status: 'success'
    }
  ];

  const getActivityIcon = (type, status) => {
    if (status === 'error') return 'AlertCircle';
    switch (type) {
      case 'published': return 'CheckCircle';
      case 'scheduled': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'pending': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (type, status) => {
    if (status === 'error') {
      return <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-full">Falhou</span>;
    }
    switch (type) {
      case 'published':
        return <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">Publicado</span>;
      case 'scheduled':
        return <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">Agendado</span>;
      default:
        return null;
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return date?.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatScheduledTime = (date) => {
    return date?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
          <p className="text-sm text-muted-foreground">Últimas ações e publicações</p>
        </div>
        <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="right">
          Ver Todas
        </Button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-150">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity?.status === 'success' ? 'bg-success/10' :
              activity?.status === 'pending' ? 'bg-warning/10' :
              activity?.status === 'error' ? 'bg-destructive/10' : 'bg-muted'
            }`}>
              <Icon 
                name={getActivityIcon(activity?.type, activity?.status)} 
                size={20} 
                className={getActivityColor(activity?.status)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground truncate pr-2">
                  {activity?.title}
                </h4>
                {getStatusBadge(activity?.type, activity?.status)}
              </div>

              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                <span>{formatTimestamp(activity?.timestamp)}</span>
                {activity?.scheduledFor && (
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>Agendado para {formatScheduledTime(activity?.scheduledFor)}</span>
                  </span>
                )}
              </div>

              {activity?.engagement && (
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Icon name="Heart" size={12} />
                    <span>{activity?.engagement?.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Icon name="MessageCircle" size={12} />
                    <span>{activity?.engagement?.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Icon name="Share2" size={12} />
                    <span>{activity?.engagement?.shares}</span>
                  </div>
                </div>
              )}

              {activity?.error && (
                <div className="mt-2 p-2 bg-destructive/5 border border-destructive/20 rounded text-xs text-destructive">
                  <Icon name="AlertTriangle" size={12} className="inline mr-1" />
                  {activity?.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {activities?.filter(a => a?.status === 'success')?.length} posts publicados hoje
          </span>
          <Button variant="ghost" size="sm" iconName="BarChart3" iconPosition="left">
            Ver Relatório
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityFeed;