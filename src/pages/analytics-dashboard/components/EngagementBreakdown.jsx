import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const EngagementBreakdown = () => {
  const engagementData = [
    { name: 'Curtidas', value: 542, color: 'var(--color-success)' },
    { name: 'Comentários', value: 165, color: 'var(--color-warning)' },
    { name: 'Compartilhamentos', value: 143, color: 'var(--color-secondary)' },
    { name: 'Cliques', value: 89, color: 'var(--color-primary)' }
  ];

  const totalEngagement = engagementData?.reduce((sum, item) => sum + item?.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      const percentage = ((data?.value / totalEngagement) * 100)?.toFixed(1);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="text-sm font-medium text-popover-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            {data?.value?.toLocaleString('pt-BR')} ({percentage?.replace('.', ',')}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Curtidas': return 'Heart';
      case 'Comentários': return 'MessageCircle';
      case 'Compartilhamentos': return 'Share2';
      case 'Cliques': return 'MousePointer';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Distribuição de Engajamento</h3>
        <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
      </div>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={engagementData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {engagementData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-4">
        {engagementData?.map((item) => {
          const percentage = ((item?.value / totalEngagement) * 100)?.toFixed(1);
          return (
            <div key={item?.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item?.color }}
                ></div>
                <div className="flex items-center space-x-2">
                  <Icon name={getIcon(item?.name)} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item?.name}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {item?.value?.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {percentage?.replace('.', ',')}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Total de Engajamentos</span>
          <span className="text-lg font-bold text-primary">
            {totalEngagement?.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EngagementBreakdown;