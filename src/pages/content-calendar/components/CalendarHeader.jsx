import React from 'react';

import Button from '../../../components/ui/Button';

const CalendarHeader = ({ 
  currentDate, 
  view, 
  onViewChange, 
  onNavigate, 
  onToday,
  filters,
  onFilterChange 
}) => {
  const formatDate = (date) => {
    return date?.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const statusFilters = [
    { value: 'all', label: 'Todos', color: 'bg-muted' },
    { value: 'draft', label: 'Rascunho', color: 'bg-warning' },
    { value: 'scheduled', label: 'Agendado', color: 'bg-primary' },
    { value: 'published', label: 'Publicado', color: 'bg-success' },
    { value: 'failed', label: 'Falhou', color: 'bg-destructive' }
  ];

  return (
    <div className="bg-card border-b border-border p-4 space-y-4">
      {/* Main Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-foreground capitalize">
            {formatDate(currentDate)}
          </h1>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('PREV')}
              iconName="ChevronLeft"
              iconSize={16}
            >
              Anterior
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToday}
            >
              Hoje
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('NEXT')}
              iconName="ChevronRight"
              iconPosition="right"
              iconSize={16}
            >
              Próximo
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('month')}
              className="px-4"
            >
              Mês
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('week')}
              className="px-4"
            >
              Semana
            </Button>
            <Button
              variant={view === 'agenda' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('agenda')}
              className="px-4 lg:hidden"
            >
              Lista
            </Button>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Filtros:</span>
          <div className="flex items-center space-x-1">
            {statusFilters?.map((filter) => (
              <button
                key={filter?.value}
                onClick={() => onFilterChange('status', filter?.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150 ${
                  filters?.status === filter?.value
                    ? `${filter?.color} text-white`
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {filter?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconSize={16}
          >
            Mais Filtros
          </Button>
          
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconSize={16}
            onClick={() => window.location.href = '/post-creation'}
          >
            Novo Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;