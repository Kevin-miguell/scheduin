import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SchedulingOptions = ({ scheduledDate, onScheduleChange, timezone, onTimezoneChange }) => {
  const [scheduleType, setScheduleType] = useState('now'); // 'now', 'schedule', 'optimal'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timezoneOptions = [
    { value: 'America/Sao_Paulo', label: 'Brasília (BRT/BRST)' },
    { value: 'America/New_York', label: 'Nova York (EST/EDT)' },
    { value: 'Europe/London', label: 'Londres (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Asia/Tokyo', label: 'Tóquio (JST)' }
  ];

  const optimalTimes = [
    { time: '08:00', label: '08:00 - Início do expediente', engagement: 'Alto', icon: 'Coffee' },
    { time: '12:00', label: '12:00 - Horário de almoço', engagement: 'Médio', icon: 'Clock' },
    { time: '17:00', label: '17:00 - Final do expediente', engagement: 'Alto', icon: 'Briefcase' },
    { time: '19:00', label: '19:00 - Pós-expediente', engagement: 'Médio', icon: 'Home' }
  ];

  const handleScheduleTypeChange = (type) => {
    setScheduleType(type);
    if (type === 'now') {
      onScheduleChange(null);
    }
  };

  const handleDateTimeChange = () => {
    if (selectedDate && selectedTime) {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      onScheduleChange(dateTime);
    }
  };

  const handleOptimalTimeSelect = (time) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    
    const dateStr = tomorrow?.toISOString()?.split('T')?.[0];
    const dateTime = new Date(`${dateStr}T${time}`);
    
    setSelectedDate(dateStr);
    setSelectedTime(time);
    onScheduleChange(dateTime);
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return date?.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    });
  };

  const getEngagementColor = (level) => {
    switch (level) {
      case 'Alto': return 'text-success';
      case 'Médio': return 'text-warning';
      case 'Baixo': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Agendamento</h3>
      </div>
      {/* Schedule Type Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="now"
            name="scheduleType"
            checked={scheduleType === 'now'}
            onChange={() => handleScheduleTypeChange('now')}
            className="w-4 h-4 text-primary focus:ring-primary border-border"
          />
          <label htmlFor="now" className="flex items-center space-x-2 cursor-pointer">
            <Icon name="Zap" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Publicar Agora</span>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="schedule"
            name="scheduleType"
            checked={scheduleType === 'schedule'}
            onChange={() => handleScheduleTypeChange('schedule')}
            className="w-4 h-4 text-primary focus:ring-primary border-border"
          />
          <label htmlFor="schedule" className="flex items-center space-x-2 cursor-pointer">
            <Icon name="Clock" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">Agendar para Data/Hora</span>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="optimal"
            name="scheduleType"
            checked={scheduleType === 'optimal'}
            onChange={() => handleScheduleTypeChange('optimal')}
            className="w-4 h-4 text-primary focus:ring-primary border-border"
          />
          <label htmlFor="optimal" className="flex items-center space-x-2 cursor-pointer">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Horário Otimizado</span>
          </label>
        </div>
      </div>
      {/* Timezone Selection */}
      <div className="space-y-2">
        <Select
          label="Fuso Horário"
          options={timezoneOptions}
          value={timezone}
          onChange={onTimezoneChange}
          className="w-full"
        />
      </div>
      {/* Custom Date/Time Selection */}
      {scheduleType === 'schedule' && (
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground">Selecionar Data e Hora</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Data"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e?.target?.value);
                setTimeout(handleDateTimeChange, 0);
              }}
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
            
            <Input
              type="time"
              label="Hora"
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e?.target?.value);
                setTimeout(handleDateTimeChange, 0);
              }}
            />
          </div>

          {scheduledDate && (
            <div className="flex items-center space-x-2 p-2 bg-primary/10 text-primary rounded-lg">
              <Icon name="Calendar" size={14} />
              <span className="text-sm font-medium">
                Agendado para: {formatDateTime(scheduledDate)}
              </span>
            </div>
          )}
        </div>
      )}
      {/* Optimal Times */}
      {scheduleType === 'optimal' && (
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Horários com Melhor Engajamento</h4>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="Info" size={12} />
              <span>Baseado no seu histórico</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {optimalTimes?.map((timeSlot, index) => (
              <button
                key={index}
                onClick={() => handleOptimalTimeSelect(timeSlot?.time)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors duration-150 group"
              >
                <div className="flex items-center space-x-3">
                  <Icon name={timeSlot?.icon} size={16} className="text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{timeSlot?.label}</p>
                    <p className="text-xs text-muted-foreground">Amanhã</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${getEngagementColor(timeSlot?.engagement)}`}>
                    {timeSlot?.engagement}
                  </span>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground group-hover:text-foreground" />
                </div>
              </button>
            ))}
          </div>

          {scheduledDate && (
            <div className="flex items-center space-x-2 p-2 bg-accent/10 text-accent rounded-lg">
              <Icon name="TrendingUp" size={14} />
              <span className="text-sm font-medium">
                Otimizado para: {formatDateTime(scheduledDate)}
              </span>
            </div>
          )}
        </div>
      )}
      {/* Scheduling Tips */}
      <div className="p-3 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Dicas de agendamento:</p>
            <p>• Terça a quinta-feira têm melhor engajamento</p>
            <p>• Evite fins de semana e feriados</p>
            <p>• Horários de pico: 8h-9h e 17h-18h</p>
            <p>• Considere o fuso horário da sua audiência</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingOptions;