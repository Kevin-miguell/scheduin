import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HashtagSuggestions = ({ content, onHashtagAdd }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [popularHashtags] = useState([
    { tag: 'linkedin', count: '2.1M', category: 'Geral' },
    { tag: 'marketing', count: '1.8M', category: 'Marketing' },
    { tag: 'vendas', count: '950K', category: 'Vendas' },
    { tag: 'lideranca', count: '720K', category: 'Liderança' },
    { tag: 'inovacao', count: '680K', category: 'Inovação' },
    { tag: 'tecnologia', count: '1.2M', category: 'Tecnologia' },
    { tag: 'empreendedorismo', count: '890K', category: 'Negócios' },
    { tag: 'carreira', count: '650K', category: 'Carreira' },
    { tag: 'networking', count: '540K', category: 'Networking' },
    { tag: 'produtividade', count: '420K', category: 'Produtividade' }
  ]);

  const [categories] = useState([
    'Todos', 'Marketing', 'Vendas', 'Liderança', 'Tecnologia', 'Negócios', 'Carreira'
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate hashtag suggestions based on content
    const words = content?.toLowerCase()?.split(' ');
    const contentSuggestions = popularHashtags?.filter(hashtag => 
      words?.some(word => word?.includes(hashtag?.tag?.substring(0, 3)))
    );
    
    setSuggestions(contentSuggestions?.slice(0, 5));
  }, [content, popularHashtags]);

  const filteredHashtags = popularHashtags?.filter(hashtag => {
    const matchesCategory = selectedCategory === 'Todos' || hashtag?.category === selectedCategory;
    const matchesSearch = hashtag?.tag?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addHashtag = (hashtag) => {
    onHashtagAdd(`#${hashtag?.tag}`);
  };

  const getValidationStatus = (hashtag) => {
    // Simulate validation based on hashtag popularity
    const count = parseInt(hashtag?.count?.replace(/[KM]/g, ''));
    if (count > 1000) return 'high';
    if (count > 500) return 'medium';
    return 'low';
  };

  const getValidationColor = (status) => {
    switch (status) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getValidationIcon = (status) => {
    switch (status) {
      case 'high': return 'TrendingUp';
      case 'medium': return 'Minus';
      case 'low': return 'TrendingDown';
      default: return 'Hash';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="Hash" size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Sugestões de Hashtags</h3>
      </div>
      {/* Content-based Suggestions */}
      {suggestions?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Baseado no seu conteúdo
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestions?.map((hashtag, index) => (
              <button
                key={index}
                onClick={() => addHashtag(hashtag)}
                className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors duration-150 text-xs"
              >
                <span>#{hashtag?.tag}</span>
                <Icon name="Plus" size={12} />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Search */}
      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          placeholder="Buscar hashtags..."
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
      {/* Popular Hashtags */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Hashtags Populares
        </h4>
        <div className="space-y-1">
          {filteredHashtags?.map((hashtag, index) => {
            const status = getValidationStatus(hashtag);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors duration-150 group"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <Icon 
                    name={getValidationIcon(status)} 
                    size={12} 
                    className={getValidationColor(status)} 
                  />
                  <span className="text-sm font-medium text-foreground">#{hashtag?.tag}</span>
                  <span className="text-xs text-muted-foreground">{hashtag?.count} posts</span>
                  <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                    {hashtag?.category}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addHashtag(hashtag)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                >
                  <Icon name="Plus" size={12} />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      {/* Hashtag Tips */}
      <div className="p-3 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Dicas para hashtags:</p>
            <p>• Use 3-5 hashtags relevantes por post</p>
            <p>• Misture hashtags populares com específicas</p>
            <p>• Evite hashtags muito genéricas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashtagSuggestions;