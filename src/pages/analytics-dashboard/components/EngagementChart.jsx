import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';


const EngagementChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');

  const engagementData = [
    { date: '05/01', impressions: 1250, likes: 45, comments: 12, shares: 8 },
    { date: '06/01', impressions: 1890, likes: 67, comments: 18, shares: 15 },
    { date: '07/01', impressions: 2340, likes: 89, comments: 24, shares: 22 },
    { date: '08/01', impressions: 1670, likes: 52, comments: 14, shares: 11 },
    { date: '09/01', impressions: 2890, likes: 134, comments: 45, shares: 38 },
    { date: '10/01', impressions: 3240, likes: 156, comments: 52, shares: 41 },
    { date: '11/01', impressions: 2780, likes: 98, comments: 31, shares: 28 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="text-sm font-medium text-popover-foreground mb-2">{`Data: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value?.toLocaleString('pt-BR')}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const timeRangeOptions = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tendência de Engajamento</h3>
          <p className="text-sm text-muted-foreground">Acompanhe o desempenho dos seus posts ao longo do tempo</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {timeRangeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setTimeRange(option?.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                  timeRange === option?.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-all duration-150 ${
                chartType === 'line' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="TrendingUp" size={16} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-all duration-150 ${
                chartType === 'bar' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="BarChart3" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={engagementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
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
                dataKey="impressions" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                name="Impressões"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                name="Curtidas"
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="comments" 
                stroke="var(--color-warning)" 
                strokeWidth={2}
                name="Comentários"
                dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="shares" 
                stroke="var(--color-secondary)" 
                strokeWidth={2}
                name="Compartilhamentos"
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={engagementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="impressions" fill="var(--color-primary)" name="Impressões" radius={[2, 2, 0, 0]} />
              <Bar dataKey="likes" fill="var(--color-success)" name="Curtidas" radius={[2, 2, 0, 0]} />
              <Bar dataKey="comments" fill="var(--color-warning)" name="Comentários" radius={[2, 2, 0, 0]} />
              <Bar dataKey="shares" fill="var(--color-secondary)" name="Compartilhamentos" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground">Impressões</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-sm text-muted-foreground">Curtidas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <span className="text-sm text-muted-foreground">Comentários</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
          <span className="text-sm text-muted-foreground">Compartilhamentos</span>
        </div>
      </div>
    </div>
  );
};

export default EngagementChart;