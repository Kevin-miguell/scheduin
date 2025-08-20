import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import RichTextEditor from './components/RichTextEditor';
import FirstCommentField from './components/FirstCommentField';
import HashtagSuggestions from './components/HashtagSuggestions';
import PostPreview from './components/PostPreview';
import MediaUpload from './components/MediaUpload';
import MediaLibrary from './components/MediaLibrary';
import SchedulingOptions from './components/SchedulingOptions';
import ActionButtons from './components/ActionButtons';

import Button from '../../components/ui/Button';

const PostCreation = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'library'
  
  // Post content state
  const [postContent, setPostContent] = useState('');
  const [firstComment, setFirstComment] = useState('');
  const [media, setMedia] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [isLoading, setIsLoading] = useState(false);

  // Character limits
  const POST_CHAR_LIMIT = 3000;
  const COMMENT_CHAR_LIMIT = 1250;

  // Validation
  const postCharCount = postContent?.length;
  const commentCharCount = firstComment?.length;
  const isPostValid = postCharCount <= POST_CHAR_LIMIT;
  const isCommentValid = commentCharCount <= COMMENT_CHAR_LIMIT;
  const hasContent = postContent?.trim()?.length > 0 || media?.length > 0;
  const isFormValid = isPostValid && isCommentValid;

  // Auto-save draft
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasContent) {
        const draftData = {
          content: postContent,
          comment: firstComment,
          media: media,
          scheduledDate: scheduledDate,
          timezone: timezone,
          lastSaved: new Date()?.toISOString()
        };
        localStorage.setItem('post-draft', JSON.stringify(draftData));
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [postContent, firstComment, media, scheduledDate, timezone, hasContent]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('post-draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setPostContent(draftData?.content || '');
        setFirstComment(draftData?.comment || '');
        setMedia(draftData?.media || []);
        setScheduledDate(draftData?.scheduledDate ? new Date(draftData.scheduledDate) : null);
        setTimezone(draftData?.timezone || 'America/Sao_Paulo');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const handleMediaAdd = (newMedia) => {
    setMedia(prev => [...prev, newMedia]);
  };

  const handleMediaRemove = (mediaId) => {
    setMedia(prev => prev?.filter(item => item?.id !== mediaId));
  };

  const handleMediaReorder = (fromIndex, toIndex) => {
    setMedia(prev => {
      const newMedia = [...prev];
      const [movedItem] = newMedia?.splice(fromIndex, 1);
      newMedia?.splice(toIndex, 0, movedItem);
      return newMedia;
    });
  };

  const handleHashtagAdd = (hashtag) => {
    const cursorPosition = document.activeElement?.selectionStart || postContent?.length;
    const newContent = postContent?.slice(0, cursorPosition) + ' ' + hashtag + postContent?.slice(cursorPosition);
    setPostContent(newContent);
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const draftData = {
        content: postContent,
        comment: firstComment,
        media: media,
        scheduledDate: scheduledDate,
        timezone: timezone,
        savedAt: new Date()?.toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('post-draft', JSON.stringify(draftData));
      alert('Rascunho salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar rascunho. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!scheduledDate) {
      alert('Selecione uma data e hora para agendar o post.');
      return;
    }

    setIsLoading(true);
    try {
      const postData = {
        content: postContent,
        comment: firstComment,
        media: media,
        scheduledDate: scheduledDate,
        timezone: timezone,
        status: 'scheduled'
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Post agendado com sucesso!');
      localStorage.removeItem('post-draft');
      navigate('/content-calendar');
    } catch (error) {
      alert('Erro ao agendar post. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishNow = async () => {
    setIsLoading(true);
    try {
      const postData = {
        content: postContent,
        comment: firstComment,
        media: media,
        publishedAt: new Date()?.toISOString(),
        timezone: timezone,
        status: 'published'
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Post publicado com sucesso!');
      localStorage.removeItem('post-draft');
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao publicar post. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearDraft = () => {
    if (confirm('Tem certeza que deseja limpar todo o conteúdo?')) {
      setPostContent('');
      setFirstComment('');
      setMedia([]);
      setScheduledDate(null);
      localStorage.removeItem('post-draft');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <SidebarNavigation 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6 pb-20 lg:pb-6">
          <BreadcrumbTrail />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Criar Post</h1>
              <p className="text-muted-foreground">Crie conteúdo envolvente para o LinkedIn</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDraft}
                iconName="Trash2"
                iconPosition="left"
                className="text-destructive hover:text-destructive"
              >
                Limpar
              </Button>
              
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 text-success rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">LinkedIn Conectado</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Section - Content Creation (60%) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Rich Text Editor */}
              <div className="bg-card border border-border rounded-lg p-6">
                <RichTextEditor
                  content={postContent}
                  onChange={setPostContent}
                  characterCount={postCharCount}
                  maxCharacters={POST_CHAR_LIMIT}
                />
              </div>

              {/* First Comment */}
              <div className="bg-card border border-border rounded-lg p-6">
                <FirstCommentField
                  comment={firstComment}
                  onChange={setFirstComment}
                  characterCount={commentCharCount}
                  maxCharacters={COMMENT_CHAR_LIMIT}
                />
              </div>

              {/* Media Upload/Library */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant={activeTab === 'upload' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('upload')}
                    iconName="Upload"
                    iconPosition="left"
                  >
                    Upload
                  </Button>
                  <Button
                    variant={activeTab === 'library' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('library')}
                    iconName="FolderOpen"
                    iconPosition="left"
                  >
                    Biblioteca
                  </Button>
                </div>

                {activeTab === 'upload' ? (
                  <MediaUpload
                    media={media}
                    onMediaAdd={handleMediaAdd}
                    onMediaRemove={handleMediaRemove}
                    onMediaReorder={handleMediaReorder}
                  />
                ) : (
                  <MediaLibrary
                    onMediaSelect={handleMediaAdd}
                  />
                )}
              </div>

              {/* Hashtag Suggestions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <HashtagSuggestions
                  content={postContent}
                  onHashtagAdd={handleHashtagAdd}
                />
              </div>
            </div>

            {/* Right Section - Preview & Actions (40%) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Preview */}
              <PostPreview
                content={postContent}
                firstComment={firstComment}
                media={media}
              />

              {/* Scheduling Options */}
              <div className="bg-card border border-border rounded-lg p-6">
                <SchedulingOptions
                  scheduledDate={scheduledDate}
                  onScheduleChange={setScheduledDate}
                  timezone={timezone}
                  onTimezoneChange={setTimezone}
                />
              </div>

              {/* Action Buttons */}
              <div className="bg-card border border-border rounded-lg p-6">
                <ActionButtons
                  onSaveDraft={handleSaveDraft}
                  onSchedulePost={handleSchedulePost}
                  onPublishNow={handlePublishNow}
                  isValid={isFormValid}
                  hasContent={hasContent}
                  scheduledDate={scheduledDate}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuickActionFAB />
    </div>
  );
};

export default PostCreation;