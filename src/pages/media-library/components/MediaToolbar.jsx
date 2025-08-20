import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MediaToolbar = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkAction,
  onUpload
}) => {
  const sortOptions = [
    { value: 'date-desc', label: 'Mais recente' },
    { value: 'date-asc', label: 'Mais antigo' },
    { value: 'name-asc', label: 'Nome A-Z' },
    { value: 'name-desc', label: 'Nome Z-A' },
    { value: 'size-desc', label: 'Maior tamanho' },
    { value: 'size-asc', label: 'Menor tamanho' },
    { value: 'usage-desc', label: 'Mais usado' }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todos os arquivos' },
    { value: 'image', label: 'Imagens' },
    { value: 'video', label: 'Vídeos' },
    { value: 'pdf', label: 'PDFs' },
    { value: 'recent', label: 'Últimos 7 dias' },
    { value: 'unused', label: 'Não utilizados' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Buscar arquivos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <Select
              options={filterOptions}
              value={filterType}
              onChange={onFilterChange}
              placeholder="Filtrar por tipo"
              className="w-40"
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Ordenar por"
              className="w-40"
            />
          </div>
        </div>

        {/* Right Section - Actions and View Controls */}
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
              <span className="text-sm font-medium">
                {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
              </span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBulkAction('download')}
                  className="h-8 px-2"
                >
                  <Icon name="Download" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBulkAction('delete')}
                  className="h-8 px-2 text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 px-3"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 px-3"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>

          {/* Upload Button */}
          <Button
            variant="default"
            onClick={onUpload}
            iconName="Upload"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            <span className="hidden sm:inline">Fazer Upload</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaToolbar;