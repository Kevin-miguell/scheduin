import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MediaLibrary = ({ onMediaSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const categories = ['Todos', 'Imagens', 'Vídeos', 'PDFs', 'Recentes'];

  const mediaLibrary = [
    {
      id: 1,
      name: 'apresentacao-vendas.pdf',
      type: 'pdf',
      size: '2.1 MB',
      url: '/assets/documents/sample.pdf',
      uploadDate: '2025-01-10',
      tags: ['vendas', 'apresentação']
    },
    {
      id: 2,
      name: 'equipe-marketing.jpg',
      type: 'image',
      size: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      uploadDate: '2025-01-09',
      tags: ['equipe', 'escritório']
    },
    {
      id: 3,
      name: 'produto-demo.mp4',
      type: 'video',
      size: '15.2 MB',
      url: '/assets/videos/demo.mp4',
      duration: '2:30',
      uploadDate: '2025-01-08',
      tags: ['produto', 'demo']
    },
    {
      id: 4,
      name: 'grafico-crescimento.png',
      type: 'image',
      size: '890 KB',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      uploadDate: '2025-01-07',
      tags: ['gráfico', 'dados']
    },
    {
      id: 5,
      name: 'evento-networking.jpg',
      type: 'image',
      size: '2.3 MB',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
      uploadDate: '2025-01-06',
      tags: ['evento', 'networking']
    },
    {
      id: 6,
      name: 'relatorio-mensal.pdf',
      type: 'pdf',
      size: '3.4 MB',
      url: '/assets/documents/report.pdf',
      uploadDate: '2025-01-05',
      tags: ['relatório', 'mensal']
    },
    {
      id: 7,
      name: 'escritorio-moderno.jpg',
      type: 'image',
      size: '1.5 MB',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      uploadDate: '2025-01-04',
      tags: ['escritório', 'workspace']
    },
    {
      id: 8,
      name: 'tutorial-produto.mp4',
      type: 'video',
      size: '28.7 MB',
      url: '/assets/videos/tutorial.mp4',
      duration: '5:15',
      uploadDate: '2025-01-03',
      tags: ['tutorial', 'educacional']
    }
  ];

  const filteredMedia = mediaLibrary?.filter(item => {
    const matchesCategory = selectedCategory === 'Todos' || 
      (selectedCategory === 'Imagens' && item?.type === 'image') ||
      (selectedCategory === 'Vídeos' && item?.type === 'video') ||
      (selectedCategory === 'PDFs' && item?.type === 'pdf') ||
      (selectedCategory === 'Recentes' && new Date(item.uploadDate) > new Date('2025-01-08'));
    
    const matchesSearch = item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleItemSelection = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev?.find(selected => selected?.id === item?.id);
      if (isSelected) {
        return prev?.filter(selected => selected?.id !== item?.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleAddSelected = () => {
    selectedItems?.forEach(item => onMediaSelect(item));
    setSelectedItems([]);
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'pdf': return 'FileText';
      default: return 'File';
    }
  };

  const getMediaColor = (type) => {
    switch (type) {
      case 'image': return 'text-success';
      case 'video': return 'text-primary';
      case 'pdf': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="FolderOpen" size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Biblioteca de Mídia</h3>
        </div>
        {selectedItems?.length > 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={handleAddSelected}
            iconName="Plus"
            iconPosition="left"
          >
            Adicionar ({selectedItems?.length})
          </Button>
        )}
      </div>
      {/* Search */}
      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          placeholder="Buscar na biblioteca..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-1">
        {categories?.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="h-7 px-2 text-xs"
          >
            {category}
          </Button>
        ))}
      </div>
      {/* Media Grid */}
      <div className="max-h-96 overflow-y-auto">
        {filteredMedia?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FolderOpen" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum arquivo encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredMedia?.map((item) => {
              const isSelected = selectedItems?.find(selected => selected?.id === item?.id);
              return (
                <div
                  key={item?.id}
                  className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-150 ${
                    isSelected 
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleItemSelection(item)}
                >
                  {/* Media Preview */}
                  <div className="aspect-square rounded-t-lg overflow-hidden bg-muted">
                    {item?.type === 'image' ? (
                      <Image
                        src={item?.url}
                        alt={item?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon 
                          name={getMediaIcon(item?.type)} 
                          size={32} 
                          className={getMediaColor(item?.type)} 
                        />
                      </div>
                    )}
                    
                    {/* Video Duration */}
                    {item?.type === 'video' && item?.duration && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {item?.duration}
                      </div>
                    )}
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <Icon name="Check" size={14} />
                      </div>
                    )}
                  </div>
                  {/* Media Info */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-foreground truncate mb-1">
                      {item?.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item?.size}</span>
                      <span>{formatDate(item?.uploadDate)}</span>
                    </div>
                    
                    {/* Tags */}
                    {item?.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item?.tags?.slice(0, 2)?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {item?.tags?.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                            +{item?.tags?.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Library Stats */}
      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
        <span>{filteredMedia?.length} arquivos encontrados</span>
        <div className="flex items-center space-x-4">
          <span>{mediaLibrary?.filter(m => m?.type === 'image')?.length} imagens</span>
          <span>{mediaLibrary?.filter(m => m?.type === 'video')?.length} vídeos</span>
          <span>{mediaLibrary?.filter(m => m?.type === 'pdf')?.length} PDFs</span>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;