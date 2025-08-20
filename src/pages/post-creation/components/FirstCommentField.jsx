import React from 'react';
import Icon from '../../../components/AppIcon';

const FirstCommentField = ({ comment, onChange, characterCount, maxCharacters }) => {
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icon name="MessageSquare" size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Primeiro Comentário</h3>
        <div className="flex-1 h-px bg-border"></div>
        <div className={`text-xs font-medium ${isOverLimit ? 'text-error' : 'text-muted-foreground'}`}>
          {characterCount}/{maxCharacters}
        </div>
      </div>
      <textarea
        value={comment}
        onChange={(e) => onChange(e?.target?.value)}
        placeholder="Adicione links externos, CTAs ou informações complementares aqui..."
        className={`w-full h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 text-sm ${
          isOverLimit ? 'border-error' : 'border-border'
        }`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
      <div className="flex items-start space-x-2 p-3 bg-muted/20 rounded-lg">
        <Icon name="Info" size={14} className="text-primary mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Por que usar o primeiro comentário?</p>
          <p>• Links externos não reduzem o alcance do post principal</p>
          <p>• Mantém o foco no conteúdo principal</p>
          <p>• Melhora a organização das informações</p>
        </div>
      </div>
    </div>
  );
};

export default FirstCommentField;