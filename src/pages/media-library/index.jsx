import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import MediaGrid from './components/MediaGrid';
import MediaToolbar from './components/MediaToolbar';
import UploadArea from './components/UploadArea';
import MediaPreview from './components/MediaPreview';
import StorageIndicator from './components/StorageIndicator';
import FolderStructure from './components/FolderStructure';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const MediaLibrary = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);

  // Mock data
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      name: "linkedin-post-design.jpg",
      type: "image/jpeg",
      size: 2048576,
      url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      uploadedAt: "2025-01-10T14:30:00Z",
      usageCount: 3,
      dimensions: { width: 1200, height: 800 },
      tags: ["design", "linkedin", "post"]
    },
    {
      id: 2,
      name: "produto-apresentacao.mp4",
      type: "video/mp4",
      size: 15728640,
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      uploadedAt: "2025-01-09T16:45:00Z",
      usageCount: 1,
      duration: "2:30",
      tags: ["produto", "apresentação"]
    },
    {
      id: 3,
      name: "relatorio-mensal.pdf",
      type: "application/pdf",
      size: 1024000,
      url: "/sample-report.pdf",
      uploadedAt: "2025-01-08T09:15:00Z",
      usageCount: 0,
      tags: ["relatório", "mensal"]
    },
    {
      id: 4,
      name: "equipe-trabalho.jpg",
      type: "image/jpeg",
      size: 3145728,
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      uploadedAt: "2025-01-07T11:20:00Z",
      usageCount: 5,
      dimensions: { width: 1920, height: 1080 },
      tags: ["equipe", "trabalho", "escritório"]
    },
    {
      id: 5,
      name: "infografico-vendas.png",
      type: "image/png",
      size: 1572864,
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      uploadedAt: "2025-01-06T13:10:00Z",
      usageCount: 2,
      dimensions: { width: 1080, height: 1080 },
      tags: ["infográfico", "vendas", "dados"]
    },
    {
      id: 6,
      name: "webinar-gravacao.mp4",
      type: "video/mp4",
      size: 52428800,
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      uploadedAt: "2025-01-05T15:30:00Z",
      usageCount: 0,
      duration: "45:12",
      tags: ["webinar", "educação"]
    }
  ]);

  const [folders, setFolders] = useState([
    { id: 1, name: "Imagens de Posts", fileCount: 3 },
    { id: 2, name: "Vídeos Promocionais", fileCount: 2 },
    { id: 3, name: "Documentos", fileCount: 1 },
    { id: 4, name: "Campanhas 2025", fileCount: 0 }
  ]);

  const storageData = {
    used: 75 * 1024 * 1024 * 1024, // 75GB
    total: 100 * 1024 * 1024 * 1024 // 100GB
  };

  // Filter and sort media items
  const filteredItems = mediaItems?.filter(item => {
      // Search filter
      if (searchQuery && !item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())) {
        return false;
      }

      // Type filter
      switch (filterType) {
        case 'image':
          return item?.type?.startsWith('image/');
        case 'video':
          return item?.type?.startsWith('video/');
        case 'pdf':
          return item?.type === 'application/pdf';
        case 'recent':
          const weekAgo = new Date();
          weekAgo?.setDate(weekAgo?.getDate() - 7);
          return new Date(item.uploadedAt) > weekAgo;
        case 'unused':
          return item?.usageCount === 0;
        default:
          return true;
      }
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        case 'date-asc':
          return new Date(a.uploadedAt) - new Date(b.uploadedAt);
        case 'name-asc':
          return a?.name?.localeCompare(b?.name);
        case 'name-desc':
          return b?.name?.localeCompare(a?.name);
        case 'size-desc':
          return b?.size - a?.size;
        case 'size-asc':
          return a?.size - b?.size;
        case 'usage-desc':
          return b?.usageCount - a?.usageCount;
        default:
          return 0;
      }
    });

  const handleItemSelect = (itemId, checked) => {
    if (itemId === 'all') {
      setSelectedItems(checked ? filteredItems?.map(item => item?.id) : []);
    } else {
      setSelectedItems(prev => 
        checked 
          ? [...prev, itemId]
          : prev?.filter(id => id !== itemId)
      );
    }
  };

  const handleItemAction = (action, item) => {
    switch (action) {
      case 'preview':
        setPreviewItem(item);
        break;
      case 'download':
        // Simulate download
        const link = document.createElement('a');
        link.href = item?.url;
        link.download = item?.name;
        link?.click();
        break;
      case 'delete':
        if (confirm(`Tem certeza que deseja excluir "${item?.name}"?`)) {
          setMediaItems(prev => prev?.filter(i => i?.id !== item?.id));
          setSelectedItems(prev => prev?.filter(id => id !== item?.id));
        }
        break;
      case 'rename':
        const newName = prompt('Novo nome:', item?.name);
        if (newName && newName?.trim()) {
          setMediaItems(prev => prev?.map(i => 
            i?.id === item?.id ? { ...i, name: newName?.trim() } : i
          ));
        }
        break;
      case 'copy-url':
        navigator.clipboard?.writeText(item?.url);
        alert('URL copiada para a área de transferência!');
        break;
      case 'use-in-post': navigate('/post-creation', { state: { selectedMedia: item } });
        break;
      default:
        console.log('Action:', action, item);
    }
  };

  const handleBulkAction = (action) => {
    const selectedItemsData = mediaItems?.filter(item => selectedItems?.includes(item?.id));
    
    switch (action) {
      case 'download':
        selectedItemsData?.forEach(item => {
          const link = document.createElement('a');
          link.href = item?.url;
          link.download = item?.name;
          link?.click();
        });
        break;
      case 'delete':
        if (confirm(`Tem certeza que deseja excluir ${selectedItems?.length} arquivo(s)?`)) {
          setMediaItems(prev => prev?.filter(item => !selectedItems?.includes(item?.id)));
          setSelectedItems([]);
        }
        break;
    }
  };

  const handleUpload = (uploadedFile) => {
    setMediaItems(prev => [uploadedFile, ...prev]);
  };

  const handleFolderCreate = (name) => {
    const newFolder = {
      id: Date.now(),
      name,
      fileCount: 0
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleFolderRename = (folderId, newName) => {
    setFolders(prev => prev?.map(folder => 
      folder?.id === folderId ? { ...folder, name: newName } : folder
    ));
  };

  const handleFolderDelete = (folderId) => {
    const folder = folders?.find(f => f?.id === folderId);
    if (folder && confirm(`Tem certeza que deseja excluir a pasta "${folder?.name}"?`)) {
      setFolders(prev => prev?.filter(f => f?.id !== folderId));
      if (currentFolder === folderId) {
        setCurrentFolder(null);
      }
    }
  };

  const handleStorageUpgrade = () => {
    alert('Redirecionando para página de upgrade...');
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <SidebarNavigation 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6 pb-20 lg:pb-6">
          <BreadcrumbTrail />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Biblioteca de Mídia</h1>
            <p className="text-muted-foreground">
              Gerencie seus arquivos de mídia para posts do LinkedIn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <StorageIndicator
                usedStorage={storageData?.used}
                totalStorage={storageData?.total}
                onUpgrade={handleStorageUpgrade}
              />
              
              <FolderStructure
                folders={folders}
                currentFolder={currentFolder}
                onFolderSelect={setCurrentFolder}
                onFolderCreate={handleFolderCreate}
                onFolderRename={handleFolderRename}
                onFolderDelete={handleFolderDelete}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <MediaToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterType={filterType}
                onFilterChange={setFilterType}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCount={selectedItems?.length}
                onBulkAction={handleBulkAction}
                onUpload={() => setShowUpload(true)}
              />

              {filteredItems?.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Image" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchQuery || filterType !== 'all' ?'Nenhum arquivo encontrado' :'Sua biblioteca está vazia'
                    }
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || filterType !== 'all' ?'Tente ajustar os filtros ou termos de busca' :'Comece fazendo upload dos seus primeiros arquivos'
                    }
                  </p>
                  {(!searchQuery && filterType === 'all') && (
                    <Button
                      variant="default"
                      onClick={() => setShowUpload(true)}
                      iconName="Upload"
                      iconPosition="left"
                    >
                      Fazer Upload
                    </Button>
                  )}
                </div>
              ) : (
                <MediaGrid
                  mediaItems={filteredItems}
                  viewMode={viewMode}
                  selectedItems={selectedItems}
                  onItemSelect={handleItemSelect}
                  onItemAction={handleItemAction}
                  onItemClick={(item) => setPreviewItem(item)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <QuickActionFAB />
      <UploadArea
        isVisible={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />
      <MediaPreview
        item={previewItem}
        isVisible={!!previewItem}
        onClose={() => setPreviewItem(null)}
        onAction={handleItemAction}
      />
    </div>
  );
};

export default MediaLibrary;