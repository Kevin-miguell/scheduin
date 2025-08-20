import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadArea = ({ onUpload, onClose, isVisible }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadQueue, setUploadQueue] = useState([]);
  const fileInputRef = useRef(null);

  const acceptedTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    'application/pdf': ['.pdf']
  };

  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const maxFiles = 10;

  const validateFile = (file) => {
    const errors = [];
    
    if (file?.size > maxFileSize) {
      errors?.push(`Arquivo muito grande. Máximo: ${formatFileSize(maxFileSize)}`);
    }

    const isValidType = Object.keys(acceptedTypes)?.some(type => {
      if (type === 'image/*') return file?.type?.startsWith('image/');
      if (type === 'video/*') return file?.type?.startsWith('video/');
      return file?.type === type;
    });

    if (!isValidType) {
      errors?.push('Tipo de arquivo não suportado');
    }

    return errors;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (files?.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos por vez`);
      return;
    }

    const validFiles = [];
    const errors = [];

    files?.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors?.length === 0) {
        validFiles?.push({
          id: Date.now() + Math.random(),
          file,
          name: file?.name,
          size: file?.size,
          type: file?.type,
          status: 'pending',
          progress: 0,
          errors: []
        });
      } else {
        errors?.push({ name: file?.name, errors: fileErrors });
      }
    });

    if (errors?.length > 0) {
      console.warn('Arquivos com erro:', errors);
    }

    if (validFiles?.length > 0) {
      setUploadQueue(prev => [...prev, ...validFiles]);
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (files) => {
    for (const fileItem of files) {
      try {
        // Simular upload com progresso
        setUploadProgress(prev => ({ ...prev, [fileItem?.id]: 0 }));
        
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [fileItem?.id]: progress }));
        }

        // Simular processamento de arquivo
        const uploadedFile = {
          id: fileItem?.id,
          name: fileItem?.name,
          size: fileItem?.size,
          type: fileItem?.type,
          url: URL.createObjectURL(fileItem?.file),
          uploadedAt: new Date()?.toISOString(),
          usageCount: 0,
          dimensions: fileItem?.type?.startsWith('image/') ? { width: 1920, height: 1080 } : null
        };

        onUpload(uploadedFile);
        
        setUploadQueue(prev => prev?.map(item => 
          item?.id === fileItem?.id 
            ? { ...item, status: 'completed' }
            : item
        ));

      } catch (error) {
        setUploadQueue(prev => prev?.map(item => 
          item?.id === fileItem?.id 
            ? { ...item, status: 'error', errors: ['Erro no upload'] }
            : item
        ));
      }
    }

    // Limpar queue após 3 segundos
    setTimeout(() => {
      setUploadQueue([]);
      setUploadProgress({});
    }, 3000);
  };

  const removeFromQueue = (fileId) => {
    setUploadQueue(prev => prev?.filter(item => item?.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress?.[fileId];
      return newProgress;
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Upload de Arquivos</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-150 ${
              isDragOver
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon name="Upload" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Suporte para imagens, vídeos e PDFs até {formatFileSize(maxFileSize)}
            </p>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="FolderOpen"
              iconPosition="left"
            >
              Selecionar Arquivos
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={Object.keys(acceptedTypes)?.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Supported Formats */}
          <div className="mt-4 text-xs text-muted-foreground">
            <p><strong>Formatos suportados:</strong></p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <strong>Imagens:</strong> JPG, PNG, GIF, WebP
              </div>
              <div>
                <strong>Vídeos:</strong> MP4, MOV, AVI, MKV
              </div>
              <div>
                <strong>Documentos:</strong> PDF
              </div>
            </div>
          </div>
        </div>

        {/* Upload Queue */}
        {uploadQueue?.length > 0 && (
          <div className="border-t border-border p-6 max-h-60 overflow-y-auto">
            <h3 className="font-medium text-foreground mb-4">Progresso do Upload</h3>
            <div className="space-y-3">
              {uploadQueue?.map((item) => (
                <div key={item?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate">
                        {item?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(item?.size)}
                      </span>
                    </div>
                    
                    {item?.status === 'pending' && (
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-150"
                          style={{ width: `${uploadProgress?.[item?.id] || 0}%` }}
                        />
                      </div>
                    )}
                    
                    {item?.status === 'completed' && (
                      <div className="flex items-center space-x-1 text-success">
                        <Icon name="CheckCircle" size={14} />
                        <span className="text-xs">Upload concluído</span>
                      </div>
                    )}
                    
                    {item?.status === 'error' && (
                      <div className="flex items-center space-x-1 text-destructive">
                        <Icon name="XCircle" size={14} />
                        <span className="text-xs">Erro no upload</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromQueue(item?.id)}
                    className="h-8 w-8"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;