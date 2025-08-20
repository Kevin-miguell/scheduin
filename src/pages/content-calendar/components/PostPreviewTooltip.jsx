import React from 'react';
import Icon from '../../../components/AppIcon';

const PostPreviewTooltip = ({ event, position, onClose }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'text-warning';
      case 'scheduled': return 'text-primary';
      case 'published': return 'text-success';
      case 'failed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return 'Edit';
      case 'scheduled': return 'Clock';
      case 'published': return 'CheckCircle';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="fixed z-1200 bg-popover border border-border rounded-lg elevation-2 p-4 max-w-sm"
      style={{
        left: `${position?.x + 10}px`,
        top: `${position?.y - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon(event?.status)} 
            size={16} 
            className={getStatusColor(event?.status)} 
          />
          <span className={`text-xs font-medium uppercase tracking-wide ${getStatusColor(event?.status)}`}>
            {event?.status === 'draft' ? 'Rascunho' :
             event?.status === 'scheduled' ? 'Agendado' :
             event?.status === 'published' ? 'Publicado' :
             'Falhou'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <Icon name="X" size={14} />
        </button>
      </div>
      {/* Content Preview */}
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-foreground text-sm mb-1">{event?.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {event?.content || "Conteúdo do post será exibido aqui..."}
          </p>
        </div>

        {/* Media Preview */}
        {event?.media && (
          <div className="flex items-center space-x-2">
            <Icon name="Image" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {event?.media?.type === 'image' ? 'Imagem anexada' :
               event?.media?.type === 'video' ? 'Vídeo anexado' :
               'Mídia anexada'}
            </span>
          </div>
        )}

        {/* Scheduling Info */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(event?.start)}
            </span>
          </div>

          {/* Engagement Prediction */}
          {event?.engagementPrediction && (
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={14} className="text-success" />
              <span className="text-xs text-success">
                Previsão: {event?.engagementPrediction?.likes} curtidas, {event?.engagementPrediction?.comments} comentários
              </span>
            </div>
          )}

          {/* Hashtags */}
          {event?.hashtags && event?.hashtags?.length > 0 && (
            <div className="flex items-center space-x-1">
              <Icon name="Hash" size={14} className="text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {event?.hashtags?.slice(0, 3)?.map((tag, index) => (
                  <span key={index} className="text-xs text-primary">
                    #{tag}
                  </span>
                ))}
                {event?.hashtags?.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{event?.hashtags?.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <button className="flex items-center space-x-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors duration-150">
            <Icon name="Edit" size={12} />
            <span>Editar</span>
          </button>
          <button className="flex items-center space-x-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors duration-150">
            <Icon name="Copy" size={12} />
            <span>Duplicar</span>
          </button>
          {event?.status === 'scheduled' && (
            <button className="flex items-center space-x-1 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors duration-150">
              <Icon name="Trash2" size={12} />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPreviewTooltip;