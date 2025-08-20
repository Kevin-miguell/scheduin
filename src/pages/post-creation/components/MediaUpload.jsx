import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MediaUpload = ({ media, onMediaAdd, onMediaRemove, onMediaReorder }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const acceptedFormats = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    video: ['.mp4', '.mov', '.avi', '.wmv'],
    pdf: ['.pdf']
  };

  const maxFileSizes = {
    image: 10 * 1024 * 1024, // 10MB
    video: 200 * 1024 * 1024, // 200MB
    pdf: 100 * 1024 * 1024 // 100MB
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    files?.forEach((file) => {
      const fileType = getFileType(file);
      const validation = validateFile(file, fileType);
      
      if (!validation?.isValid) {
        alert(validation?.error);
        return;
      }

      // Simulate upload progress
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaItem = {
          id: fileId,
          name: file?.name,
          type: fileType,
          size: formatFileSize(file?.size),
          url: e?.target?.result,
          file: file
        };

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress?.[fileId];
              return newProgress;
            });
            onMediaAdd(mediaItem);
          } else {
            setUploadProgress(prev => ({ ...prev, [fileId]: Math.round(progress) }));
          }
        }, 200);
      };

      reader?.readAsDataURL(file);
    });
  };

  const getFileType = (file) => {
    if (file?.type?.startsWith('image/')) return 'image';
    if (file?.type?.startsWith('video/')) return 'video';
    if (file?.type === 'application/pdf') return 'pdf';
    return 'unknown';
  };

  const validateFile = (file, type) => {
    if (type === 'unknown') {
      return { isValid: false, error: 'Formato de arquivo não suportado' };
    }

    if (file?.size > maxFileSizes?.[type]) {
      return { 
        isValid: false, 
        error: `Arquivo muito grande. Máximo permitido: ${formatFileSize(maxFileSizes?.[type])}` 
      };
    }

    if (type === 'image' && media?.filter(m => m?.type === 'image')?.length >= 10) {
      return { isValid: false, error: 'Máximo de 10 imagens por post' };
    }

    if (type === 'video' && media?.some(m => m?.type === 'video')) {
      return { isValid: false, error: 'Apenas um vídeo por post' };
    }

    if (type === 'pdf' && media?.some(m => m?.type === 'pdf')) {
      return { isValid: false, error: 'Apenas um PDF por post' };
    }

    return { isValid: true };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="Upload" size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Mídia</h3>
      </div>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-150 ${
          dragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Imagens, vídeos ou PDFs • Máx. 10 imagens, 1 vídeo ou 1 PDF
        </p>
        
        <Button
          variant="outline"
          onClick={() => fileInputRef?.current?.click()}
          iconName="Plus"
          iconPosition="left"
        >
          Selecionar Arquivos
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.values(acceptedFormats)?.flat()?.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress)?.length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
            <div key={fileId} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Upload" size={16} className="text-primary" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Enviando...</span>
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Media List */}
      {media?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Arquivos Adicionados ({media?.length})
          </h4>
          
          <div className="space-y-2">
            {media?.map((item, index) => (
              <div key={item?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg group">
                {item?.type === 'image' ? (
                  <Image
                    src={item?.url}
                    alt={item?.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <Icon 
                      name={getMediaIcon(item?.type)} 
                      size={20} 
                      className={getMediaColor(item?.type)} 
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item?.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="capitalize">{item?.type}</span>
                    <span>•</span>
                    <span>{item?.size}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMediaReorder(index, index - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="ChevronUp" size={14} />
                    </Button>
                  )}
                  {index < media?.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMediaReorder(index, index + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="ChevronDown" size={14} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMediaRemove(item?.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Format Guidelines */}
      <div className="p-3 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={14} className="text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Formatos aceitos:</p>
            <p>• <strong>Imagens:</strong> JPG, PNG, GIF, WebP (máx. 10MB cada, até 10 imagens)</p>
            <p>• <strong>Vídeos:</strong> MP4, MOV, AVI, WMV (máx. 200MB, apenas 1 vídeo)</p>
            <p>• <strong>PDFs:</strong> Documentos PDF (máx. 100MB, apenas 1 arquivo)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;