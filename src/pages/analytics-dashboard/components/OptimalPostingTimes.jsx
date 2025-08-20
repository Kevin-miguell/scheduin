import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const OptimalPostingTimes = () => {
  const [selectedDay, setSelectedDay] = useState('all');

  const weekDays = [
    { value: 'all', label: 'Todos os dias' },
    { value: 'monday', label: 'Segunda' },
    { value: 'tuesday', label: 'Terça' },
    { value: 'wednesday', label: 'Quarta' },
    { value: 'thursday', label: 'Quinta' },
    { value: 'friday', label: 'Sexta' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  const timeSlots = [
    { time: '06:00', engagement: 15, label: '6h' },
    { time: '07:00', engagement: 25, label: '7h' },
    { time: '08:00', engagement: 45, label: '8h' },
    { time: '09:00', engagement: 78, label: '9h' },
    { time: '10:00', engagement: 92, label: '10h' },
    { time: '11:00', engagement: 85, label: '11h' },
    { time: '12:00', engagement: 67, label: '12h' },
    { time: '13:00', engagement: 55, label: '13h' },
    { time: '14:00', engagement: 72, label: '14h' },
    { time: '15:00', engagement: 88, label: '15h' },
    { time: '16:00', engagement: 95, label: '16h' },
    { time: '17:00', engagement: 89, label: '17h' },
    { time: '18:00', engagement: 76, label: '18h' },
    { time: '19:00', engagement: 58, label: '19h' },
    { time: '20:00', engagement: 42, label: '20h' },
    { time: '21:00', engagement: 35, label: '21h' },
    { time: '22:00', engagement: 28, label: '22h' },
    { time: '23:00', engagement: 18, label: '23h' }
  ];

  const maxEngagement = Math.max(...timeSlots?.map(slot => slot?.engagement));

  const getEngagementLevel = (engagement) => {
    const percentage = (engagement / maxEngagement) * 100;
    if (percentage >= 80) return { level: 'high', color: 'bg-success', text: 'Alto' };
    if (percentage >= 50) return { level: 'medium', color: 'bg-warning', text: 'Médio' };
    return { level: 'low', color: 'bg-muted', text: 'Baixo' };
  };

  const topTimes = timeSlots?.sort((a, b) => b?.engagement - a?.engagement)?.slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Melhores Horários para Postar</h3>
        <p className="text-sm text-muted-foreground">Baseado no engajamento dos últimos 30 dias (BRT)</p>
      </div>
      {/* Day Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {weekDays?.map((day) => (
            <button
              key={day?.value}
              onClick={() => setSelectedDay(day?.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                selectedDay === day?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {day?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Top 3 Times */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Top 3 Horários</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topTimes?.map((time, index) => (
            <div key={time?.time} className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon 
                  name={index === 0 ? 'Crown' : index === 1 ? 'Medal' : 'Award'} 
                  size={20} 
                  className={index === 0 ? 'text-warning' : index === 1 ? 'text-muted-foreground' : 'text-accent'} 
                />
              </div>
              <p className="text-lg font-bold text-foreground">{time?.label}</p>
              <p className="text-sm text-muted-foreground">
                {time?.engagement}% engajamento
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Heatmap */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Mapa de Calor - Engajamento por Hora</h4>
        <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-12 gap-2">
          {timeSlots?.map((slot) => {
            const { level, color } = getEngagementLevel(slot?.engagement);
            return (
              <div
                key={slot?.time}
                className={`aspect-square ${color} rounded-lg flex flex-col items-center justify-center p-2 hover:elevation-1 transition-all duration-150 cursor-pointer group`}
                title={`${slot?.label}: ${slot?.engagement}% engajamento`}
              >
                <span className={`text-xs font-medium ${
                  level === 'high' ? 'text-success-foreground' : 
                  level === 'medium' ? 'text-warning-foreground' : 
                  'text-muted-foreground'
                }`}>
                  {slot?.label}
                </span>
                <span className={`text-xs ${
                  level === 'high' ? 'text-success-foreground' : 
                  level === 'medium' ? 'text-warning-foreground' : 
                  'text-muted-foreground'
                }`}>
                  {slot?.engagement}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded"></div>
          <span className="text-muted-foreground">Alto (80%+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning rounded"></div>
          <span className="text-muted-foreground">Médio (50-79%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-muted rounded"></div>
          <span className="text-muted-foreground">Baixo (&lt;50%)</span>
        </div>
      </div>
      {/* Timezone Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Horário de Brasília (BRT/BRST)</span>
        </div>
      </div>
    </div>
  );
};

export default OptimalPostingTimes;