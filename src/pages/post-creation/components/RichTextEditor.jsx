import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RichTextEditor = ({ content, onChange, characterCount, maxCharacters }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef(null);

  const emojis = [
    '😊', '👍', '🎉', '💡', '🚀', '📈', '💼', '🌟',
    '🔥', '💪', '🎯', '✨', '📊', '🏆', '💯', '🤝',
    '📱', '💻', '🌐', '📝', '🎨', '🔧', '⚡', '🌈'
  ];

  const formatText = (format) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const selectedText = content?.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'bullet':
          formattedText = `• ${selectedText}`;
          break;
        case 'number':
          formattedText = `1. ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newContent = content?.substring(0, start) + formattedText + content?.substring(end);
      onChange(newContent);
    }
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea?.selectionStart;
    const newContent = content?.substring(0, start) + emoji + content?.substring(start);
    onChange(newContent);
    setShowEmojiPicker(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + emoji?.length, start + emoji?.length);
    }, 0);
  };

  const handleTextChange = (e) => {
    onChange(e?.target?.value);
  };

  const handleTextSelect = () => {
    const textarea = textareaRef?.current;
    if (textarea) {
      const start = textarea?.selectionStart;
      const end = textarea?.selectionEnd;
      setSelectedText(content?.substring(start, end));
    }
  };

  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className="space-y-4">
      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="h-8 w-8 p-0"
            disabled={!selectedText}
          >
            <Icon name="Bold" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="h-8 w-8 p-0"
            disabled={!selectedText}
          >
            <Icon name="Italic" size={16} />
          </Button>
          <div className="w-px h-4 bg-border mx-2"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('bullet')}
            className="h-8 w-8 p-0"
            disabled={!selectedText}
          >
            <Icon name="List" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('number')}
            className="h-8 w-8 p-0"
            disabled={!selectedText}
          >
            <Icon name="ListOrdered" size={16} />
          </Button>
          <div className="w-px h-4 bg-border mx-2"></div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="h-8 w-8 p-0"
            >
              <Icon name="Smile" size={16} />
            </Button>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute top-10 left-0 w-64 bg-popover border border-border rounded-lg elevation-2 z-50">
                <div className="p-3">
                  <h4 className="text-sm font-medium text-popover-foreground mb-2">Emojis</h4>
                  <div className="grid grid-cols-8 gap-1">
                    {emojis?.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted/50 rounded transition-colors duration-150"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Character Counter */}
        <div className={`text-sm font-medium ${isOverLimit ? 'text-error' : 'text-muted-foreground'}`}>
          {characterCount}/{maxCharacters}
        </div>
      </div>
      {/* Text Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextChange}
          onSelect={handleTextSelect}
          placeholder="O que você gostaria de compartilhar com sua rede profissional?"
          className={`w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 ${
            isOverLimit ? 'border-error' : 'border-border'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        
        {/* Helper Text */}
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {selectedText ? 'Texto selecionado - use a barra de formatação' : 'Selecione texto para formatar'}
        </div>
      </div>
      {/* Formatting Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 <strong>Dicas de formatação:</strong></p>
        <p>• Selecione texto e use os botões de formatação</p>
        <p>• **texto** para negrito, *texto* para itálico</p>
        <p>• Use emojis para tornar seu post mais envolvente</p>
      </div>
    </div>
  );
};

export default RichTextEditor;