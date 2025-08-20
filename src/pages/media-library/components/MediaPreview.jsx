import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MediaPreview = ({ item, isVisible, onClose, onAction }) => {
  if (!isVisible || !item) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMediaContent = () => {
    if (item?.type?.startsWith('image/')) {
      return (
        <div className="flex-1 flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
          <Image
            src={item?.url}
            alt={item?.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (item?.type?.startsWith('video/')) {
      return (
        <div className="flex-1 flex items-center justify-center bg-black rounded-lg overflow-hidden">
          <video
            src={item?.url}
            controls
            className="max-w-full max-h-full"
            preload="metadata"
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      );
    }

    if (item?.type === 'application/pdf') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-muted/30 rounded-lg">
          <Icon name="FileText" size={64} className="text-red-600 mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Documento PDF</p>
          <p className="text-sm text-muted-foreground mb-4">
            Clique em "Baixar" para visualizar o arquivo
          </p>
          <Button
            variant="outline"
            onClick={() => onAction('download', item)}
            iconName="Download"
            iconPosition="left"
          >
            Baixar PDF
          </Button>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/30 rounded-lg">
        <Icon name="File" size={64} className="text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground">Arquivo não suportado</p>
        <p className="text-sm text-muted-foreground">
          Tipo: {item?.type}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-1300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-foreground truncate">
              {item?.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {formatFileSize(item?.size)} • Enviado em {formatDate(item?.uploadedAt)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('download', item)}
              iconName="Download"
              iconPosition="left"
            >
              Baixar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Media Display */}
          <div className="flex-1 p-6">
            {renderMediaContent()}
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-border p-6 bg-muted/20 overflow-y-auto">
            <h3 className="font-semibold text-foreground mb-4">Detalhes do Arquivo</h3>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="text-sm text-foreground mt-1 break-all">{item?.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <p className="text-sm text-foreground mt-1">{item?.type}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Tamanho</label>
                <p className="text-sm text-foreground mt-1">{formatFileSize(item?.size)}</p>
              </div>

              {item?.dimensions && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dimensões</label>
                  <p className="text-sm text-foreground mt-1">
                    {item?.dimensions?.width} × {item?.dimensions?.height} pixels
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Upload</label>
                <p className="text-sm text-foreground mt-1">{formatDate(item?.uploadedAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Uso em Posts</label>
                <p className="text-sm text-foreground mt-1">
                  {item?.usageCount} {item?.usageCount === 1 ? 'vez' : 'vezes'}
                </p>
              </div>

              {/* Tags */}
              {item?.tags && item?.tags?.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium text-muted-foreground mb-3 block">Ações</label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => onAction('rename', item)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Renomear
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => onAction('copy-url', item)}
                    iconName="Copy"
                    iconPosition="left"
                  >
                    Copiar URL
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => onAction('use-in-post', item)}
                    iconName="PenTool"
                    iconPosition="left"
                  >
                    Usar em Post
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    fullWidth
                    onClick={() => onAction('delete', item)}
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPreview;