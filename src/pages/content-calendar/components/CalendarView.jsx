import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';

import PostPreviewTooltip from './PostPreviewTooltip';

moment?.locale('pt-br');
const localizer = momentLocalizer(moment);

const CalendarView = ({ 
  view, 
  currentDate, 
  events, 
  onSelectEvent, 
  onSelectSlot, 
  onEventDrop,
  filters 
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    onSelectEvent(event);
  }, [onSelectEvent]);

  const handleEventMouseEnter = useCallback((event, e) => {
    setSelectedEvent(event);
    setTooltipPosition({ x: e?.clientX, y: e?.clientY });
    setShowTooltip(true);
  }, []);

  const handleEventMouseLeave = useCallback(() => {
    setShowTooltip(false);
    setTimeout(() => setSelectedEvent(null), 200);
  }, []);

  const eventStyleGetter = useCallback((event) => {
    const statusColors = {
      draft: { backgroundColor: '#F59E0B', borderColor: '#D97706' },
      scheduled: { backgroundColor: '#0A66C2', borderColor: '#0A66C2' },
      published: { backgroundColor: '#10B981', borderColor: '#059669' },
      failed: { backgroundColor: '#EF4444', borderColor: '#DC2626' }
    };

    const colors = statusColors?.[event?.status] || statusColors?.scheduled;
    
    return {
      style: {
        backgroundColor: colors?.backgroundColor,
        borderColor: colors?.borderColor,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        padding: '2px 6px'
      }
    };
  }, []);

  const CustomEvent = ({ event }) => (
    <div className="flex items-center space-x-1 truncate">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
        event?.status === 'draft' ? 'bg-warning' :
        event?.status === 'scheduled' ? 'bg-primary' :
        event?.status === 'published'? 'bg-success' : 'bg-destructive'
      }`} />
      <span className="truncate text-xs">{event?.title}</span>
    </div>
  );

  const CustomToolbar = () => null; // We use our custom header

  const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há posts agendados neste período.',
    showMore: (total) => `+${total} mais`
  };

  const formats = {
    dateFormat: 'DD',
    dayFormat: (date, culture, localizer) => localizer?.format(date, 'dddd', culture),
    dayHeaderFormat: (date, culture, localizer) => localizer?.format(date, 'dddd DD/MM', culture),
    monthHeaderFormat: (date, culture, localizer) => localizer?.format(date, 'MMMM YYYY', culture),
    agendaDateFormat: 'DD/MM/YYYY',
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) => 
      `${localizer?.format(start, 'HH:mm', culture)} - ${localizer?.format(end, 'HH:mm', culture)}`
  };

  const filteredEvents = events?.filter(event => {
    if (filters?.status === 'all') return true;
    return event?.status === filters?.status;
  });

  return (
    <div className="flex-1 bg-card relative">
      <div className="h-full p-4">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          date={currentDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={onSelectSlot}
          onEventDrop={onEventDrop}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar
          }}
          messages={messages}
          formats={formats}
          culture="pt-BR"
          selectable
          resizable
          dragAndDropAccessor="isDraggable"
          className="rbc-calendar"
          style={{ height: 'calc(100vh - 200px)' }}
          onMouseEnter={(event, e) => handleEventMouseEnter(event, e)}
          onMouseLeave={handleEventMouseLeave}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && selectedEvent && (
        <PostPreviewTooltip
          event={selectedEvent}
          position={tooltipPosition}
          onClose={() => setShowTooltip(false)}
        />
      )}

      {/* Peak Engagement Indicators */}
      <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 elevation-1">
        <h4 className="text-sm font-medium text-foreground mb-2">Horários de Pico</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">09:00 - 11:00</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">14:00 - 16:00</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">19:00 - 21:00</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .rbc-calendar {
          font-family: 'Inter', sans-serif;
        }
        
        .rbc-header {
          background-color: var(--color-muted);
          color: var(--color-foreground);
          font-weight: 500;
          padding: 8px;
          border-bottom: 1px solid var(--color-border);
        }
        
        .rbc-month-view {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-date-cell {
          padding: 4px;
          text-align: right;
        }
        
        .rbc-today {
          background-color: var(--color-primary)/10;
        }
        
        .rbc-off-range-bg {
          background-color: var(--color-muted)/30;
        }
        
        .rbc-event {
          border-radius: 4px;
          padding: 2px 4px;
          margin: 1px 0;
          cursor: pointer;
        }
        
        .rbc-event:hover {
          opacity: 0.8;
        }
        
        .rbc-show-more {
          background-color: var(--color-muted);
          color: var(--color-muted-foreground);
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 11px;
        }
        
        .rbc-week-view .rbc-time-slot {
          border-top: 1px solid var(--color-border);
        }
        
        .rbc-time-view .rbc-time-gutter {
          background-color: var(--color-muted);
        }
        
        .rbc-agenda-view {
          border: 1px solid var(--color-border);
          border-radius: 8px;
        }
        
        .rbc-agenda-view table {
          width: 100%;
        }
        
        .rbc-agenda-date-cell {
          background-color: var(--color-muted);
          font-weight: 500;
        }
        
        .rbc-agenda-time-cell {
          background-color: var(--color-muted);
        }
      `}</style>
    </div>
  );
};

export default CalendarView;