import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PostPreview = ({ content, firstComment, media, authorName = "João Silva", authorTitle = "Marketing Manager" }) => {
  const formatContent = (text) => {
    if (!text) return '';
    
    // Convert markdown-style formatting to HTML-like display
    return text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')?.replace(/\*(.*?)\*/g, '<em>$1</em>')?.replace(/\n/g, '<br />');
  };

  const renderMedia = () => {
    if (!media || media?.length === 0) return null;

    if (media?.length === 1) {
      const item = media?.[0];
      return (
        <div className="mt-3 rounded-lg overflow-hidden bg-muted">
          {item?.type === 'image' && (
            <Image
              src={item?.url}
              alt={item?.name}
              className="w-full h-64 object-cover"
            />
          )}
          {item?.type === 'video' && (
            <div className="relative w-full h-64 bg-black flex items-center justify-center">
              <Icon name="Play" size={48} className="text-white" />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {item?.duration || '0:30'}
              </div>
            </div>
          )}
          {item?.type === 'pdf' && (
            <div className="p-4 flex items-center space-x-3">
              <div className="w-12 h-12 bg-error rounded flex items-center justify-center">
                <Icon name="FileText" size={24} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item?.name}</p>
                <p className="text-sm text-muted-foreground">PDF • {item?.size || '2.1 MB'}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Multiple images carousel preview
    return (
      <div className="mt-3 rounded-lg overflow-hidden bg-muted">
        <div className="relative">
          <div className="grid grid-cols-2 gap-1">
            {media?.slice(0, 4)?.map((item, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={item?.url}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                />
                {index === 3 && media?.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium">+{media?.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {media?.length} fotos
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Eye" size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Pré-visualização do Post</h3>
      </div>
      {/* LinkedIn Post Preview */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Post Header */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
              {authorName?.split(' ')?.map(n => n?.[0])?.join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <h4 className="font-semibold text-gray-900">{authorName}</h4>
                <span className="text-gray-500">• 1º</span>
              </div>
              <p className="text-sm text-gray-600">{authorTitle}</p>
              <p className="text-xs text-gray-500">Agora • 🌐</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Icon name="MoreHorizontal" size={20} />
            </button>
          </div>
        </div>

        {/* Post Content */}
        {content && (
          <div className="px-4 pb-3">
            <div 
              className="text-gray-900 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
          </div>
        )}

        {/* Media */}
        {renderMedia()}

        {/* Engagement Bar */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icon name="ThumbsUp" size={10} className="text-white" />
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={10} className="text-white" />
                </div>
              </div>
              <span>15 reações</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>3 comentários</span>
              <span>2 compartilhamentos</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-around">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <Icon name="ThumbsUp" size={16} />
              <span className="text-sm font-medium">Curtir</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <Icon name="MessageCircle" size={16} />
              <span className="text-sm font-medium">Comentar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <Icon name="Repeat2" size={16} />
              <span className="text-sm font-medium">Repostar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
              <Icon name="Send" size={16} />
              <span className="text-sm font-medium">Enviar</span>
            </button>
          </div>
        </div>

        {/* First Comment Preview */}
        {firstComment && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-xs">
                {authorName?.split(' ')?.map(n => n?.[0])?.join('')}
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{authorName}</span>
                    <span className="text-xs text-gray-500">Autor</span>
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{firstComment}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <button className="hover:text-gray-700">Curtir</button>
                  <button className="hover:text-gray-700">Responder</button>
                  <span>Agora</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Preview Info */}
      <div className="flex items-start space-x-2 p-3 bg-muted/20 rounded-lg">
        <Icon name="Info" size={14} className="text-primary mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p>Esta é uma pré-visualização de como seu post aparecerá no LinkedIn. A formatação e layout podem variar ligeiramente na plataforma real.</p>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;