import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  onSaveDraft, 
  onSchedulePost, 
  onPublishNow, 
  isValid, 
  hasContent, 
  scheduledDate,
  isLoading = false 
}) => {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleAction = async (action, callback) => {
    setLoadingAction(action);
    try {
      await callback();
    } finally {
      setLoadingAction(null);
    }
  };

  const canPublish = hasContent && isValid;
  const canSchedule = hasContent && isValid && scheduledDate;
  const canSaveDraft = hasContent;

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex flex-col space-y-3">
        {/* Publish Now */}
        <Button
          variant="default"
          size="lg"
          onClick={() => handleAction('publish', onPublishNow)}
          disabled={!canPublish || isLoading}
          loading={loadingAction === 'publish'}
          iconName="Zap"
          iconPosition="left"
          fullWidth
          className="h-12"
        >
          {loadingAction === 'publish' ? 'Publicando...' : 'Publicar Agora'}
        </Button>

        {/* Schedule Post */}
        <Button
          variant="secondary"
          size="lg"
          onClick={() => handleAction('schedule', onSchedulePost)}
          disabled={!canSchedule || isLoading}
          loading={loadingAction === 'schedule'}
          iconName="Calendar"
          iconPosition="left"
          fullWidth
          className="h-12"
        >
          {loadingAction === 'schedule' ? 'Agendando...' : 'Agendar Post'}
        </Button>

        {/* Save Draft */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleAction('draft', onSaveDraft)}
          disabled={!canSaveDraft || isLoading}
          loading={loadingAction === 'draft'}
          iconName="Save"
          iconPosition="left"
          fullWidth
          className="h-12"
        >
          {loadingAction === 'draft' ? 'Salvando...' : 'Salvar Rascunho'}
        </Button>
      </div>
      {/* Action Status */}
      <div className="space-y-2">
        {scheduledDate && (
          <div className="flex items-center space-x-2 p-3 bg-secondary/10 text-secondary rounded-lg">
            <Icon name="Calendar" size={16} />
            <div className="flex-1">
              <p className="text-sm font-medium">Post Agendado</p>
              <p className="text-xs opacity-80">
                {scheduledDate?.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        )}

        {!isValid && hasContent && (
          <div className="flex items-start space-x-2 p-3 bg-warning/10 text-warning rounded-lg">
            <Icon name="AlertTriangle" size={16} className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Atenção Necessária</p>
              <p className="text-xs opacity-80">
                Verifique o limite de caracteres e formatos de mídia
              </p>
            </div>
          </div>
        )}

        {!hasContent && (
          <div className="flex items-start space-x-2 p-3 bg-muted/30 text-muted-foreground rounded-lg">
            <Icon name="Edit3" size={16} className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Comece a Escrever</p>
              <p className="text-xs opacity-80">
                Adicione conteúdo para habilitar as ações
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Ações Rápidas</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            className="justify-start"
          >
            Duplicar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            className="justify-start"
          >
            Pré-visualizar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            iconPosition="left"
            className="justify-start"
          >
            Compartilhar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconPosition="left"
            className="justify-start"
          >
            Exportar
          </Button>
        </div>
      </div>
      {/* Publishing Guidelines */}
      <div className="p-3 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={14} className="text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Antes de publicar:</p>
            <p>• Revise o conteúdo e formatação</p>
            <p>• Verifique links e hashtags</p>
            <p>• Confirme data e horário de agendamento</p>
            <p>• Teste a pré-visualização</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;