import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PostsDataTable = () => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const postsData = [
    {
      id: 1,
      date: '11/01/2025',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      content: `Dicas essenciais para aumentar o engajamento no LinkedIn\n\nCompartilhando estratégias que funcionam...`,
      impressions: 3240,
      likes: 156,
      comments: 52,
      shares: 41,
      engagementRate: 7.7,
      linkedinUrl: 'https://linkedin.com/posts/example1'
    },
    {
      id: 2,
      date: '10/01/2025',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=100&h=100&fit=crop',
      content: `Como criar conteúdo que gera resultados\n\nO segredo está na consistência e valor agregado...`,
      impressions: 2890,
      likes: 134,
      comments: 45,
      shares: 38,
      engagementRate: 7.5,
      linkedinUrl: 'https://linkedin.com/posts/example2'
    },
    {
      id: 3,
      date: '09/01/2025',
      thumbnail: 'https://images.pixabay.com/photo/2016/11/29/06/15/plans-1867745_1280.jpg?w=100&h=100&fit=crop',
      content: `Planejamento estratégico para 2025\n\nDefina metas claras e alcançáveis para o próximo ano...`,
      impressions: 2340,
      likes: 89,
      comments: 24,
      shares: 22,
      engagementRate: 5.8,
      linkedinUrl: 'https://linkedin.com/posts/example3'
    },
    {
      id: 4,
      date: '08/01/2025',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
      content: `Networking eficaz no ambiente digital\n\nConstrua relacionamentos genuínos online...`,
      impressions: 1890,
      likes: 67,
      comments: 18,
      shares: 15,
      engagementRate: 5.3,
      linkedinUrl: 'https://linkedin.com/posts/example4'
    },
    {
      id: 5,
      date: '07/01/2025',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=100&h=100&fit=crop',
      content: `Tendências de marketing digital para 2025\n\nO que esperar do mercado nos próximos meses...`,
      impressions: 1670,
      likes: 52,
      comments: 14,
      shares: 11,
      engagementRate: 4.6,
      linkedinUrl: 'https://linkedin.com/posts/example5'
    },
    {
      id: 6,
      date: '06/01/2025',
      thumbnail: 'https://images.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg?w=100&h=100&fit=crop',
      content: `Empreendedorismo e inovação\n\nComo transformar ideias em negócios de sucesso...`,
      impressions: 1250,
      likes: 45,
      comments: 12,
      shares: 8,
      engagementRate: 5.2,
      linkedinUrl: 'https://linkedin.com/posts/example6'
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...postsData]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'date') {
      aValue = new Date(aValue.split('/').reverse().join('-'));
      bValue = new Date(bValue.split('/').reverse().join('-'));
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const formatNumber = (num) => {
    return num?.toLocaleString('pt-BR');
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const truncateContent = (content, maxLength = 80) => {
    if (content?.length <= maxLength) return content;
    return content?.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Posts Publicados</h3>
            <p className="text-sm text-muted-foreground">Histórico completo com métricas de engajamento</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Exportar CSV
            </Button>
            <Button variant="outline" size="sm" iconName="FileText" iconPosition="left">
              Relatório PDF
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Post</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150"
                >
                  <span>Data</span>
                  <Icon name={getSortIcon('date')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('impressions')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150 ml-auto"
                >
                  <span>Impressões</span>
                  <Icon name={getSortIcon('impressions')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('likes')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150 ml-auto"
                >
                  <span>Curtidas</span>
                  <Icon name={getSortIcon('likes')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('comments')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150 ml-auto"
                >
                  <span>Comentários</span>
                  <Icon name={getSortIcon('comments')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('shares')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150 ml-auto"
                >
                  <span>Compartilhamentos</span>
                  <Icon name={getSortIcon('shares')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('engagementRate')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150 ml-auto"
                >
                  <span>Taxa de Engajamento</span>
                  <Icon name={getSortIcon('engagementRate')} size={14} />
                </button>
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((post) => (
              <tr key={post?.id} className="border-b border-border hover:bg-muted/20 transition-colors duration-150">
                <td className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={post?.thumbnail}
                        alt="Post thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium leading-5">
                        {truncateContent(post?.content)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{post?.date}</td>
                <td className="p-4 text-sm text-foreground text-right font-medium">
                  {formatNumber(post?.impressions)}
                </td>
                <td className="p-4 text-sm text-foreground text-right font-medium">
                  {formatNumber(post?.likes)}
                </td>
                <td className="p-4 text-sm text-foreground text-right font-medium">
                  {formatNumber(post?.comments)}
                </td>
                <td className="p-4 text-sm text-foreground text-right font-medium">
                  {formatNumber(post?.shares)}
                </td>
                <td className="p-4 text-sm text-foreground text-right font-medium">
                  {post?.engagementRate?.toFixed(1)?.replace('.', ',')}%
                </td>
                <td className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ExternalLink"
                    onClick={() => window.open(post?.linkedinUrl, '_blank')}
                  >
                    Ver no LinkedIn
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {paginatedData?.map((post) => (
          <div key={post?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={post?.thumbnail}
                  alt="Post thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium leading-5 mb-2">
                  {truncateContent(post?.content, 100)}
                </p>
                <p className="text-xs text-muted-foreground">{post?.date}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">{formatNumber(post?.impressions)}</p>
                <p className="text-xs text-muted-foreground">Impressões</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-success">{formatNumber(post?.likes)}</p>
                <p className="text-xs text-muted-foreground">Curtidas</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-warning">{formatNumber(post?.comments)}</p>
                <p className="text-xs text-muted-foreground">Comentários</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-secondary">{formatNumber(post?.shares)}</p>
                <p className="text-xs text-muted-foreground">Compartilhamentos</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">{post?.engagementRate?.toFixed(1)?.replace('.', ',')}%</p>
                <p className="text-xs text-muted-foreground">Taxa de Engajamento</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="ExternalLink"
                onClick={() => window.open(post?.linkedinUrl, '_blank')}
              >
                Ver Post
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedData?.length)} de {sortedData?.length} posts
            </p>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm rounded-md transition-all duration-150 ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsDataTable;