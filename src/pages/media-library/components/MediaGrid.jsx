import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MediaGrid = ({ 
  mediaItems, 
  viewMode, 
  selectedItems, 
  onItemSelect, 
  onItemAction,
  onItemClick 
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileTypeIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image';
    if (type?.startsWith('video/')) return 'Video';
    if (type === 'application/pdf') return 'FileText';
    return 'File';
  };

  const getFileTypeColor = (type) => {
    if (type?.startsWith('image/')) return 'text-blue-600';
    if (type?.startsWith('video/')) return 'text-purple-600';
    if (type === 'application/pdf') return 'text-red-600';
    return 'text-gray-600';
  };

  const handleContextMenu = (e, item) => {
    e?.preventDefault();
    onItemAction('context', item);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedItems?.length === mediaItems?.length}
              onChange={(e) => onItemSelect('all', e?.target?.checked)}
              className="rounded border-border"
            />
          </div>
          <div className="col-span-4">Nome</div>
          <div className="col-span-2">Tipo</div>
          <div className="col-span-2">Tamanho</div>
          <div className="col-span-2">Modificado</div>
          <div className="col-span-1">Ações</div>
        </div>
        <div className="divide-y divide-border">
          {mediaItems?.map((item) => (
            <div
              key={item?.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors duration-150"
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedItems?.includes(item?.id)}
                  onChange={(e) => onItemSelect(item?.id, e?.target?.checked)}
                  className="rounded border-border"
                />
              </div>
              
              <div className="col-span-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {item?.type?.startsWith('image/') ? (
                    <Image
                      src={item?.url}
                      alt={item?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon
                      name={getFileTypeIcon(item?.type)}
                      size={20}
                      className={getFileTypeColor(item?.type)}
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground truncate">{item?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item?.dimensions && `${item?.dimensions?.width}×${item?.dimensions?.height}`}
                  </p>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-foreground capitalize">
                  {item?.type?.split('/')?.[1] || item?.type}
                </span>
              </div>
              
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-foreground">
                  {formatFileSize(item?.size)}
                </span>
              </div>
              
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-muted-foreground">
                  {new Date(item.uploadedAt)?.toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="col-span-1 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onItemAction('menu', item)}
                  className="h-8 w-8"
                >
                  <Icon name="MoreHorizontal" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {mediaItems?.map((item) => (
        <div
          key={item?.id}
          className="relative group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-150 cursor-pointer"
          onMouseEnter={() => setHoveredItem(item?.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => onItemClick(item)}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {/* Selection Checkbox */}
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selectedItems?.includes(item?.id)}
              onChange={(e) => {
                e?.stopPropagation();
                onItemSelect(item?.id, e?.target?.checked);
              }}
              className="rounded border-border bg-white/90 backdrop-blur-sm"
            />
          </div>

          {/* Usage Count Badge */}
          {item?.usageCount > 0 && (
            <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {item?.usageCount}
            </div>
          )}

          {/* Media Preview */}
          <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
            {item?.type?.startsWith('image/') ? (
              <Image
                src={item?.url}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            ) : item?.type?.startsWith('video/') ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <Icon name="Play" size={32} className="text-white" />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item?.duration || '0:00'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Icon
                  name={getFileTypeIcon(item?.type)}
                  size={32}
                  className={getFileTypeColor(item?.type)}
                />
                <span className="text-xs text-muted-foreground uppercase">
                  {item?.type?.split('/')?.[1] || 'FILE'}
                </span>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="p-3">
            <p className="font-medium text-sm text-foreground truncate" title={item?.name}>
              {item?.name}
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {formatFileSize(item?.size)}
              </span>
              {item?.dimensions && (
                <span className="text-xs text-muted-foreground">
                  {item?.dimensions?.width}×{item?.dimensions?.height}
                </span>
              )}
            </div>
          </div>

          {/* Hover Overlay */}
          {hoveredItem === item?.id && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2 transition-opacity duration-150">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onItemAction('preview', item);
                }}
              >
                <Icon name="Eye" size={16} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onItemAction('download', item);
                }}
              >
                <Icon name="Download" size={16} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onItemAction('menu', item);
                }}
              >
                <Icon name="MoreHorizontal" size={16} />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;