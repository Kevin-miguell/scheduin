import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AnalyticsFilters = ({ onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30d',
    postType: 'all',
    minImpressions: '',
    minEngagement: '',
    startDate: '',
    endDate: ''
  });

  const dateRangeOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const postTypeOptions = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'text', label: 'Apenas texto' },
    { value: 'image', label: 'Com imagem' },
    { value: 'video', label: 'Com vídeo' },
    { value: 'document', label: 'Com documento' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const clearFilters = () => {
    const defaultFilters = {
      dateRange: '30d',
      postType: 'all',
      minImpressions: '',
      minEngagement: '',
      startDate: '',
      endDate: ''
    };
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const hasActiveFilters = () => {
    return filters?.postType !== 'all' || 
           filters?.minImpressions !== '' || 
           filters?.minEngagement !== '' ||
           filters?.dateRange === 'custom';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Filtros de Análise</h3>
          {hasActiveFilters() && (
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          >
            {isExpanded ? 'Menos' : 'Mais'} Filtros
          </Button>
        </div>
      </div>
      {/* Quick Date Range Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dateRangeOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => handleFilterChange('dateRange', option?.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
              filters?.dateRange === option?.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {option?.label}
          </button>
        ))}
      </div>
      {/* Custom Date Range */}
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
          <Input
            type="date"
            label="Data inicial"
            value={filters?.startDate}
            onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
          />
          <Input
            type="date"
            label="Data final"
            value={filters?.endDate}
            onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
          />
        </div>
      )}
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Post Type Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Post
              </label>
              <div className="space-y-2">
                {postTypeOptions?.map((option) => (
                  <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="postType"
                      value={option?.value}
                      checked={filters?.postType === option?.value}
                      onChange={(e) => handleFilterChange('postType', e?.target?.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-foreground">{option?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Performance Filters */}
            <div>
              <Input
                type="number"
                label="Impressões mínimas"
                placeholder="Ex: 1000"
                value={filters?.minImpressions}
                onChange={(e) => handleFilterChange('minImpressions', e?.target?.value)}
                description="Filtrar posts com pelo menos X impressões"
              />
            </div>

            <div>
              <Input
                type="number"
                label="Taxa de engajamento mínima (%)"
                placeholder="Ex: 5"
                value={filters?.minEngagement}
                onChange={(e) => handleFilterChange('minEngagement', e?.target?.value)}
                description="Filtrar posts com pelo menos X% de engajamento"
              />
            </div>
          </div>

          {/* Quick Performance Filters */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Filtros Rápidos de Performance
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleFilterChange('minImpressions', '1000');
                  handleFilterChange('minEngagement', '5');
                }}
                className="px-3 py-1.5 text-sm bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors duration-150"
              >
                Alto Desempenho
              </button>
              <button
                onClick={() => {
                  handleFilterChange('minImpressions', '500');
                  handleFilterChange('minEngagement', '2');
                }}
                className="px-3 py-1.5 text-sm bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors duration-150"
              >
                Desempenho Médio
              </button>
              <button
                onClick={() => {
                  handleFilterChange('minImpressions', '100');
                  handleFilterChange('minEngagement', '1');
                }}
                className="px-3 py-1.5 text-sm bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors duration-150"
              >
                Baixo Desempenho
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>
              Filtros ativos: {filters?.postType !== 'all' && 'Tipo de post, '}
              {filters?.minImpressions && 'Impressões mínimas, '}
              {filters?.minEngagement && 'Engajamento mínimo, '}
              {filters?.dateRange === 'custom' && 'Período personalizado'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;