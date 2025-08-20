import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import MetricsCard from './components/MetricsCard';
import WeeklyCalendarWidget from './components/WeeklyCalendarWidget';
import EngagementChart from './components/EngagementChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import PeakEngagementTimes from './components/PeakEngagementTimes';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const metricsData = [
    {
      title: "Posts Agendados",
      value: "12",
      change: "+3",
      changeType: "positive",
      icon: "Calendar",
      color: "primary"
    },
    {
      title: "Publicados Este Mês",
      value: "47",
      change: "+12%",
      changeType: "positive", 
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Taxa de Engajamento",
      value: "4,2%",
      change: "+0,8%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "warning"
    },
    {
      title: "Crescimento de Seguidores",
      value: "1.234",
      change: "+156",
      changeType: "positive",
      icon: "Users",
      color: "secondary"
    }
  ];

  const formatCurrentTime = () => {
    return currentTime?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  };

  const formatCurrentDate = () => {
    return currentTime?.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Sao_Paulo'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <SidebarNavigation 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16`}>
        <div className="p-6 pb-20 lg:pb-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <BreadcrumbTrail />
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
              <p className="text-muted-foreground">
                Bem-vindo de volta! Aqui está um resumo da sua atividade no LinkedIn.
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end space-y-1">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>{formatCurrentTime()} BRT</span>
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {formatCurrentDate()}
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Calendar Widget */}
            <div className="xl:col-span-2">
              <WeeklyCalendarWidget />
            </div>
            
            {/* Right Column - Peak Times */}
            <div>
              <PeakEngagementTimes />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Engagement Chart */}
            <div>
              <EngagementChart />
            </div>
            
            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="mb-8">
            <RecentActivityFeed />
          </div>

          {/* Footer Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Icon name="Target" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">87%</div>
                  <div className="text-sm text-muted-foreground">Meta de Engajamento</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-success/10 text-success rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">2,3h</div>
                  <div className="text-sm text-muted-foreground">Tempo Economizado</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-warning/10 text-warning rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">94%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickActionFAB />
    </div>
  );
};

export default Dashboard;