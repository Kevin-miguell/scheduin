import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EngagementChart = () => {
  const engagementData = [
    { day: 'Seg', likes: 45, comments: 12, shares: 8, impressions: 1200 },
    { day: 'Ter', likes: 52, comments: 18, shares: 15, impressions: 1450 },
    { day: 'Qua', likes: 38, comments: 9, shares: 6, impressions: 980 },
    { day: 'Qui', likes: 67, comments: 24, shares: 19, impressions: 1800 },
    { day: 'Sex', likes: 71, comments: 28, shares: 22, impressions: 1950 },
    { day: 'Sáb', likes: 29, comments: 7, shares: 4, impressions: 650 },
    { day: 'Dom', likes: 33, comments: 11, shares: 7, impressions: 750 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-1">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value?.toLocaleString('pt-BR')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Engajamento Semanal</h3>
          <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Curtidas</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Comentários</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Compartilhamentos</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="likes" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              name="Curtidas"
            />
            <Line 
              type="monotone" 
              dataKey="comments" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              name="Comentários"
            />
            <Line 
              type="monotone" 
              dataKey="shares" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              name="Compartilhamentos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">335</div>
            <div className="text-xs text-muted-foreground">Total Curtidas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">109</div>
            <div className="text-xs text-muted-foreground">Total Comentários</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">81</div>
            <div className="text-xs text-muted-foreground">Total Compartilhamentos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementChart;