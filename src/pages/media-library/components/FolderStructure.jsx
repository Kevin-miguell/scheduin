import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FolderStructure = ({ 
  folders, 
  currentFolder, 
  onFolderSelect, 
  onFolderCreate, 
  onFolderRename, 
  onFolderDelete 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName?.trim()) {
      onFolderCreate(newFolderName?.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const handleRenameFolder = (folderId) => {
    if (editName?.trim()) {
      onFolderRename(folderId, editName?.trim());
      setEditingFolder(null);
      setEditName('');
    }
  };

  const startRename = (folder) => {
    setEditingFolder(folder?.id);
    setEditName(folder?.name);
  };

  const cancelEdit = () => {
    setEditingFolder(null);
    setEditName('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground flex items-center space-x-2">
          <Icon name="Folder" size={20} />
          <span>Pastas</span>
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreating(true)}
          iconName="FolderPlus"
          iconPosition="left"
        >
          Nova Pasta
        </Button>
      </div>
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-4 text-sm">
        <button
          onClick={() => onFolderSelect(null)}
          className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors duration-150 ${
            currentFolder === null 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Icon name="Home" size={14} />
          <span>Todos os arquivos</span>
        </button>
        
        {currentFolder && (
          <>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            <span className="px-2 py-1 bg-primary text-primary-foreground rounded">
              {folders?.find(f => f?.id === currentFolder)?.name || 'Pasta'}
            </span>
          </>
        )}
      </div>
      {/* Create New Folder */}
      {isCreating && (
        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Nome da pasta"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && handleCreateFolder()}
              className="flex-1"
              autoFocus
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateFolder}
              disabled={!newFolderName?.trim()}
            >
              <Icon name="Check" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false);
                setNewFolderName('');
              }}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}
      {/* Folders List */}
      <div className="space-y-1">
        {folders?.map((folder) => (
          <div
            key={folder?.id}
            className={`group flex items-center justify-between p-2 rounded-lg transition-colors duration-150 ${
              currentFolder === folder?.id
                ? 'bg-primary/10 text-primary' :'hover:bg-muted/50'
            }`}
          >
            {editingFolder === folder?.id ? (
              <div className="flex items-center space-x-2 flex-1">
                <Icon name="Folder" size={16} className="text-muted-foreground" />
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e?.target?.value)}
                  onKeyPress={(e) => {
                    if (e?.key === 'Enter') handleRenameFolder(folder?.id);
                    if (e?.key === 'Escape') cancelEdit();
                  }}
                  className="flex-1 h-8"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRenameFolder(folder?.id)}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Check" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onFolderSelect(folder?.id)}
                  className="flex items-center space-x-2 flex-1 text-left"
                >
                  <Icon name="Folder" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{folder?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({folder?.fileCount} {folder?.fileCount === 1 ? 'arquivo' : 'arquivos'})
                  </span>
                </button>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startRename(folder)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFolderDelete(folder?.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {folders?.length === 0 && !isCreating && (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Folder" size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma pasta criada ainda</p>
          <p className="text-xs mt-1">Organize seus arquivos criando pastas</p>
        </div>
      )}
    </div>
  );
};

export default FolderStructure;