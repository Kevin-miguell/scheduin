import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SidePanel = ({ selectedDate, events, onEventEdit, onEventDelete }) => {
  const [selectedEvents, setSelectedEvents] = useState([]);

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
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

  const dayEvents = events?.filter(event => {
    const eventDate = new Date(event.start);
    const selected = new Date(selectedDate);
    return eventDate?.toDateString() === selected?.toDateString();
  })?.sort((a, b) => new Date(a.start) - new Date(b.start));

  const handleEventSelect = (eventId) => {
    setSelectedEvents(prev => 
      prev?.includes(eventId) 
        ? prev?.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents?.length === dayEvents?.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(dayEvents?.map(event => event?.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for events:`, selectedEvents);
    setSelectedEvents([]);
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-1">
          {selectedDate ? formatDate(selectedDate) : 'Selecione uma data'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dayEvents?.length} {dayEvents?.length === 1 ? 'post agendado' : 'posts agendados'}
        </p>
      </div>
      {/* Bulk Actions */}
      {dayEvents?.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedEvents?.length === dayEvents?.length && dayEvents?.length > 0}
                onChange={handleSelectAll}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">
                Selecionar todos ({selectedEvents?.length})
              </span>
            </label>
          </div>

          {selectedEvents?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('reschedule')}
                iconName="Calendar"
                iconSize={14}
              >
                Reagendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('duplicate')}
                iconName="Copy"
                iconSize={14}
              >
                Duplicar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                iconName="Trash2"
                iconSize={14}
              >
                Excluir
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Events List */}
      <div className="flex-1 overflow-y-auto">
        {dayEvents?.length === 0 ? (
          <div className="p-4 text-center">
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
          <div className="p-4 space-y-3">
            {dayEvents?.map((event) => (
              <div
                key={event?.id}
                className="bg-muted/30 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors duration-150"
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedEvents?.includes(event?.id)}
                    onChange={() => handleEventSelect(event?.id)}
                    className="mt-1 rounded border-border"
                  />
                  
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
                    
                    <h4 className="font-medium text-foreground text-sm mb-1 truncate">
                      {event?.title}
                    </h4>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {event?.content || "Conteúdo do post..."}
                    </p>

                    {/* Media Indicator */}
                    {event?.media && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Icon 
                          name={event?.media?.type === 'image' ? 'Image' : 
                                event?.media?.type === 'video' ? 'Video' : 'File'} 
                          size={12} 
                          className="text-muted-foreground" 
                        />
                        <span className="text-xs text-muted-foreground">
                          {event?.media?.type === 'image' ? 'Imagem' :
                           event?.media?.type === 'video'? 'Vídeo' : 'Arquivo'}
                        </span>
                      </div>
                    )}

                    {/* Hashtags */}
                    {event?.hashtags && event?.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {event?.hashtags?.slice(0, 2)?.map((tag, index) => (
                          <span key={index} className="text-xs text-primary">
                            #{tag}
                          </span>
                        ))}
                        {event?.hashtags?.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{event?.hashtags?.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEventEdit(event)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-background hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon name="Edit" size={12} />
                        <span>Editar</span>
                      </button>
                      
                      <button
                        onClick={() => console.log('Duplicate event:', event?.id)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-background hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon name="Copy" size={12} />
                        <span>Duplicar</span>
                      </button>

                      {event?.status === 'scheduled' && (
                        <button
                          onClick={() => onEventDelete(event)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors duration-150"
                        >
                          <Icon name="Trash2" size={12} />
                          <span>Cancelar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <h4 className="text-sm font-medium text-foreground mb-3">Estatísticas do Dia</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {dayEvents?.filter(e => e?.status === 'scheduled')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Agendados</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              {dayEvents?.filter(e => e?.status === 'published')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Publicados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;