import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MobileCalendarView = ({ events, currentDate, onDateChange, onEventEdit, filters }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    return date?.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-warning';
      case 'scheduled': return 'bg-primary';
      case 'published': return 'bg-success';
      case 'failed': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'scheduled': return 'Agendado';
      case 'published': return 'Publicado';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  // Generate dates for the week view
  const generateWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek?.setDate(date?.getDate() - date?.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      week?.push(day);
    }
    return week;
  };

  const weekDates = generateWeekDates(currentDate);

  const getEventsForDate = (date) => {
    return events?.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate?.toDateString() === date?.toDateString();
    })?.filter(event => {
      if (filters?.status === 'all') return true;
      return event?.status === filters?.status;
    })?.sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setDate(currentDate?.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
  };

  return (
    <div className="lg:hidden flex flex-col h-full bg-background">
      {/* Week Navigation */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
            iconName="ChevronLeft"
            iconSize={16}
          >
            Anterior
          </Button>
          
          <h2 className="font-semibold text-foreground">
            {currentDate?.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
            iconName="ChevronRight"
            iconPosition="right"
            iconSize={16}
          >
            Próximo
          </Button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDates?.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isSelected = date?.toDateString() === selectedDate?.toDateString();
            const isToday = date?.toDateString() === new Date()?.toDateString();
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`p-2 rounded-lg text-center transition-all duration-150 ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : isToday 
                      ? 'bg-primary/10 text-primary' :'hover:bg-muted'
                }`}
              >
                <div className="text-xs font-medium">
                  {date?.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div className={`text-sm font-semibold ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {date?.getDate()}
                </div>
                {dayEvents?.length > 0 && (
                  <div className="flex justify-center mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-primary-foreground' : 'bg-primary'
                    }`} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Selected Date Events */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              {formatDate(selectedDate)}
            </h3>
            <span className="text-sm text-muted-foreground">
              {selectedDateEvents?.length} {selectedDateEvents?.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {selectedDateEvents?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Nenhum post agendado para esta data
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/post-creation'}
                iconName="Plus"
                iconSize={14}
              >
                Criar Post
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents?.map((event) => (
                <div
                  key={event?.id}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors duration-150"
                >
                  <div className="flex items-start space-x-3">
                    {/* Drag Handle */}
                    <div className="flex flex-col space-y-1 mt-1 cursor-grab active:cursor-grabbing">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(event?.status)}`} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {getStatusText(event?.status)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(event?.start)}
                        </span>
                      </div>

                      <h4 className="font-medium text-foreground mb-1">
                        {event?.title}
                      </h4>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {event?.content || "Conteúdo do post..."}
                      </p>

                      {/* Media and Hashtags */}
                      <div className="flex items-center space-x-4 mb-3">
                        {event?.media && (
                          <div className="flex items-center space-x-1">
                            <Icon 
                              name={event?.media?.type === 'image' ? 'Image' : 
                                    event?.media?.type === 'video' ? 'Video' : 'File'} 
                              size={14} 
                              className="text-muted-foreground" 
                            />
                            <span className="text-xs text-muted-foreground">
                              {event?.media?.type === 'image' ? 'Imagem' :
                               event?.media?.type === 'video'? 'Vídeo' : 'Arquivo'}
                            </span>
                          </div>
                        )}

                        {event?.hashtags && event?.hashtags?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Hash" size={14} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {event?.hashtags?.length} hashtags
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEventEdit(event)}
                          iconName="Edit"
                          iconSize={14}
                        >
                          Editar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Duplicate event:', event?.id)}
                          iconName="Copy"
                          iconSize={14}
                        >
                          Duplicar
                        </Button>

                        {event?.status === 'scheduled' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => console.log('Cancel event:', event?.id)}
                            iconName="Trash2"
                            iconSize={14}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Quick Action Button */}
      <div className="p-4 border-t border-border bg-card">
        <Button
          variant="default"
          fullWidth
          onClick={() => window.location.href = '/post-creation'}
          iconName="Plus"
          iconSize={16}
        >
          Criar Novo Post
        </Button>
      </div>
    </div>
  );
};

export default MobileCalendarView;