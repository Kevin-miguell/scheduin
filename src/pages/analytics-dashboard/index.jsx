import React, { useState } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import MetricCard from './components/MetricCard';
import EngagementChart from './components/EngagementChart';
import PostsDataTable from './components/PostsDataTable';
import EngagementBreakdown from './components/EngagementBreakdown';
import OptimalPostingTimes from './components/OptimalPostingTimes';
import AnalyticsFilters from './components/AnalyticsFilters';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AnalyticsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({});

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Here you would typically update your data based on the filters
    console.log('Filters updated:', newFilters);
  };

  const handleExportReport = (format) => {
    console.log(`Exporting report in ${format} format`);
    // Implementation for export functionality
  };

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Total de Impressões',
      value: 15420,
      change: '+12,5%',
      changeType: 'positive',
      icon: 'Eye',
      color: 'primary'
    },
    {
      title: 'Taxa de Engajamento',
      value: 6.8,
      change: '+2,3%',
      changeType: 'positive',
      icon: 'Heart',
      color: 'success'
    },
    {
      title: 'Crescimento de Seguidores',
      value: 234,
      change: '+18,7%',
      changeType: 'positive',
      icon: 'UserPlus',
      color: 'secondary'
    },
    {
      title: 'Post com Melhor Performance',
      value: 3240,
      change: 'Impressões',
      changeType: 'neutral',
      icon: 'TrendingUp',
      color: 'warning'
    }
  ];

  const sidebarWidth = sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60';

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <SidebarNavigation 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={handleToggleSidebar} 
      />
      <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${sidebarWidth}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <BreadcrumbTrail />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Análises de Performance
                </h1>
                <p className="text-muted-foreground">
                  Acompanhe o desempenho dos seus posts no LinkedIn com insights detalhados
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => handleExportReport('csv')}
                >
                  Exportar CSV
                </Button>
                <Button
                  variant="outline"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={() => handleExportReport('pdf')}
                >
                  Relatório PDF
                </Button>
                <Button
                  variant="default"
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Atualizar Dados
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <AnalyticsFilters onFiltersChange={handleFiltersChange} />

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <EngagementChart />
            </div>
            <div>
              <EngagementBreakdown />
            </div>
          </div>

          {/* Optimal Posting Times */}
          <div className="mb-8">
            <OptimalPostingTimes />
          </div>

          {/* Posts Data Table */}
          <div className="mb-8">
            <PostsDataTable />
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="BarChart3" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Resumo de Performance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                    <span className="text-sm font-medium text-foreground">Melhor dia da semana</span>
                  </div>
                  <span className="text-sm font-semibold text-success">Quinta-feira</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Melhor horário</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">16:00 - 17:00</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Hash" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">Hashtag mais eficaz</span>
                  </div>
                  <span className="text-sm font-semibold text-warning">#marketing</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Zap" size={20} className="text-secondary" />
                <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  iconName="PenTool"
                  iconPosition="left"
                  onClick={() => window.location.href = '/post-creation'}
                >
                  Criar Novo Post
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => window.location.href = '/content-calendar'}
                >
                  Agendar Post
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  iconName="BarChart3"
                  iconPosition="left"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Ver Dashboard
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Última atualização: {new Date()?.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickActionFAB />
    </div>
  );
};

export default AnalyticsDashboard;