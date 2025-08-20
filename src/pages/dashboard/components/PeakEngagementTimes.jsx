import React from 'react';
import Icon from '../../../components/AppIcon';

const PeakEngagementTimes = () => {
  const peakTimes = [
    {
      time: "09:00",
      day: "Segunda-feira",
      engagement: 85,
      description: "Início da semana - alta atividade profissional"
    },
    {
      time: "14:30",
      day: "Terça-feira", 
      engagement: 92,
      description: "Pós-almoço - momento de networking"
    },
    {
      time: "16:00",
      day: "Quarta-feira",
      engagement: 78,
      description: "Meio da tarde - pausa para conteúdo"
    },
    {
      time: "11:15",
      day: "Quinta-feira",
      engagement: 88,
      description: "Meio da manhã - pico de produtividade"
    },
    {
      time: "15:45",
      day: "Sexta-feira",
      engagement: 95,
      description: "Final da semana - maior engajamento"
    }
  ];

  const getEngagementColor = (engagement) => {
    if (engagement >= 90) return 'bg-success text-success-foreground';
    if (engagement >= 80) return 'bg-warning text-warning-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

  const getEngagementIcon = (engagement) => {
    if (engagement >= 90) return 'TrendingUp';
    if (engagement >= 80) return 'BarChart3';
    return 'Activity';
  };

  const currentTime = new Date()?.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });

  const currentDay = new Date()?.toLocaleDateString('pt-BR', { 
    weekday: 'long',
    timeZone: 'America/Sao_Paulo'
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Horários de Pico</h3>
          <p className="text-sm text-muted-foreground">Melhores momentos para publicar</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-foreground">{currentTime}</div>
          <div className="text-xs text-muted-foreground capitalize">{currentDay}</div>
        </div>
      </div>
      <div className="space-y-4">
        {peakTimes?.map((peak, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-150">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getEngagementColor(peak?.engagement)}`}>
              <Icon name={getEngagementIcon(peak?.engagement)} size={20} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{peak?.time}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground capitalize">{peak?.day}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    peak?.engagement >= 90 ? 'bg-success' :
                    peak?.engagement >= 80 ? 'bg-warning' : 'bg-secondary'
                  }`}></div>
                  <span className="text-xs font-medium text-foreground">{peak?.engagement}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{peak?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={16} />
            <span>Fuso horário: BRT (UTC-3)</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Ótimo</span>
            <div className="w-2 h-2 bg-warning rounded-full ml-2"></div>
            <span className="text-muted-foreground">Bom</span>
            <div className="w-2 h-2 bg-secondary rounded-full ml-2"></div>
            <span className="text-muted-foreground">Regular</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeakEngagementTimes;