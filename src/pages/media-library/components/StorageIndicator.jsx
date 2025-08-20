import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StorageIndicator = ({ usedStorage, totalStorage, onUpgrade }) => {
  const usedPercentage = (usedStorage / totalStorage) * 100;
  const remainingStorage = totalStorage - usedStorage;
  
  const formatStorage = (bytes) => {
    if (bytes === 0) return '0 GB';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb?.toFixed(1)} GB`;
  };

  const getStorageColor = () => {
    if (usedPercentage >= 90) return 'bg-destructive';
    if (usedPercentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  const getStorageStatus = () => {
    if (usedPercentage >= 90) return 'critical';
    if (usedPercentage >= 75) return 'warning';
    return 'normal';
  };

  const status = getStorageStatus();

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="HardDrive" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Armazenamento</h3>
        </div>
        
        {status !== 'normal' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUpgrade}
            iconName="ArrowUp"
            iconPosition="left"
          >
            Fazer Upgrade
          </Button>
        )}
      </div>
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-border rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStorageColor()}`}
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
        </div>
      </div>
      {/* Storage Details */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {formatStorage(usedStorage)} de {formatStorage(totalStorage)} usado
        </span>
        <span className={`font-medium ${
          status === 'critical' ? 'text-destructive' :
          status === 'warning'? 'text-warning' : 'text-muted-foreground'
        }`}>
          {usedPercentage?.toFixed(1)}%
        </span>
      </div>
      {/* Storage Breakdown */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Imagens</span>
            </div>
            <span className="font-medium text-foreground">
              {formatStorage(usedStorage * 0.6)}
            </span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-muted-foreground">Vídeos</span>
            </div>
            <span className="font-medium text-foreground">
              {formatStorage(usedStorage * 0.35)}
            </span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">PDFs</span>
            </div>
            <span className="font-medium text-foreground">
              {formatStorage(usedStorage * 0.05)}
            </span>
          </div>
        </div>
      </div>
      {/* Warning Messages */}
      {status === 'critical' && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Armazenamento quase esgotado
              </p>
              <p className="text-xs text-destructive/80 mt-1">
                Restam apenas {formatStorage(remainingStorage)}. Faça upgrade para continuar enviando arquivos.
              </p>
            </div>
          </div>
        </div>
      )}
      {status === 'warning' && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">
                Armazenamento em alerta
              </p>
              <p className="text-xs text-warning/80 mt-1">
                Restam {formatStorage(remainingStorage)}. Considere fazer upgrade em breve.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageIndicator;