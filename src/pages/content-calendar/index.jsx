import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import CalendarHeader from './components/CalendarHeader';
import CalendarView from './components/CalendarView';
import SidePanel from './components/SidePanel';
import MobileCalendarView from './components/MobileCalendarView';

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all'
  });

  // Mock events data
  const [events] = useState([
    {
      id: 1,
      title: "Dicas de Marketing Digital para B2B",
      content: `Compartilhando algumas estratégias essenciais de marketing digital que têm funcionado muito bem para empresas B2B:\n\n1. Content Marketing focado em educação\n2. LinkedIn como canal principal\n3. Automação de email marketing\n4. SEO para palavras-chave específicas do nicho\n\nQual dessas estratégias vocês já implementaram? Compartilhem suas experiências nos comentários! 👇`,
      start: new Date(2025, 7, 12, 9, 0),
      end: new Date(2025, 7, 12, 9, 30),
      status: 'scheduled',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
      },
      hashtags: ['MarketingDigital', 'B2B', 'LinkedIn', 'ContentMarketing'],
      engagementPrediction: {
        likes: 45,
        comments: 12,
        shares: 8
      },
      isDraggable: true
    },
    {
      id: 2,
      title: "Tendências de IA para 2025",
      content: `A inteligência artificial está revolucionando diversos setores. Aqui estão as principais tendências que devemos acompanhar em 2025:\n\n🤖 IA Generativa em processos criativos\n📊 Machine Learning para análise preditiva\n🔒 IA responsável e ética\n💼 Automação inteligente de processos\n\nComo sua empresa está se preparando para essas mudanças?`,
      start: new Date(2025, 7, 13, 14, 0),
      end: new Date(2025, 7, 13, 14, 30),
      status: 'scheduled',
      media: {
        type: 'video',
        url: 'video-placeholder.mp4'
      },
      hashtags: ['IA', 'InteligenciaArtificial', 'Tecnologia', 'Inovacao'],
      engagementPrediction: {
        likes: 78,
        comments: 23,
        shares: 15
      },
      isDraggable: true
    },
    {
      id: 3,
      title: "Networking Eficaz no LinkedIn",
      content: `Dicas práticas para fazer networking de qualidade no LinkedIn:\n\n✅ Personalize sempre seus convites de conexão\n✅ Comente de forma relevante nos posts dos outros\n✅ Compartilhe conteúdo de valor regularmente\n✅ Participe de grupos da sua área\n✅ Seja genuíno nas suas interações\n\nLembrem-se: networking é sobre construir relacionamentos, não apenas coletar contatos!`,
      start: new Date(2025, 7, 14, 19, 0),
      end: new Date(2025, 7, 14, 19, 30),
      status: 'draft',
      hashtags: ['Networking', 'LinkedIn', 'CarreiraDigital', 'Relacionamentos'],
      isDraggable: true
    },
    {
      id: 4,
      title: "Resultados Q3 - Crescimento de 40%",
      content: `Estou muito feliz em compartilhar os resultados do terceiro trimestre! 📈\n\n🎯 40% de crescimento em receita\n👥 25% de aumento na base de clientes\n⭐ 95% de satisfação do cliente\n🚀 Expansão para 3 novos mercados\n\nObrigado a toda equipe pelo trabalho excepcional e aos nossos clientes pela confiança!`,
      start: new Date(2025, 7, 11, 10, 0),
      end: new Date(2025, 7, 11, 10, 30),
      status: 'published',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
      },
      hashtags: ['Resultados', 'Crescimento', 'Equipe', 'Sucesso'],
      engagementPrediction: {
        likes: 156,
        comments: 34,
        shares: 22
      },
      isDraggable: false
    },
    {
      id: 5,
      title: "Workshop: Liderança Digital",
      content: `Convite especial! 🎯\n\nEstarei ministrando um workshop sobre "Liderança na Era Digital" na próxima semana.\n\n📅 Data: 18/08/2025\n⏰ Horário: 14h às 17h\n📍 Local: Centro de Convenções SP\n💰 Investimento: R$ 150\n\nTemas abordados:\n• Gestão de equipes remotas\n• Ferramentas digitais para líderes\n• Comunicação eficaz online\n• Cultura organizacional digital\n\nVagas limitadas! Link para inscrições nos comentários.`,
      start: new Date(2025, 7, 15, 16, 0),
      end: new Date(2025, 7, 15, 16, 30),
      status: 'scheduled',
      hashtags: ['Workshop', 'Lideranca', 'Digital', 'Evento'],
      engagementPrediction: {
        likes: 89,
        comments: 18,
        shares: 12
      },
      isDraggable: true
    },
    {
      id: 6,
      title: "Falha no agendamento - Post sobre sustentabilidade",
      content: `Post sobre práticas sustentáveis em empresas de tecnologia que falhou no agendamento devido a erro de conexão com a API do LinkedIn.`,
      start: new Date(2025, 7, 10, 8, 0),
      end: new Date(2025, 7, 10, 8, 30),
      status: 'failed',
      hashtags: ['Sustentabilidade', 'Tecnologia', 'ESG'],
      isDraggable: true
    }
  ]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate);
    
    if (action === 'PREV') {
      if (view === 'month') {
        newDate?.setMonth(currentDate?.getMonth() - 1);
      } else if (view === 'week') {
        newDate?.setDate(currentDate?.getDate() - 7);
      }
    } else if (action === 'NEXT') {
      if (view === 'month') {
        newDate?.setMonth(currentDate?.getMonth() + 1);
      } else if (view === 'week') {
        newDate?.setDate(currentDate?.getDate() + 7);
      }
    }
    
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo?.start);
    console.log('Selected slot:', slotInfo);
  };

  const handleEventDrop = ({ event, start, end }) => {
    console.log('Event dropped:', { event, start, end });
    // Here you would update the event in your state/database
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleEventEdit = (event) => {
    console.log('Edit event:', event);
    // Navigate to post creation with event data
    window.location.href = `/post-creation?edit=${event?.id}`;
  };

  const handleEventDelete = (event) => {
    console.log('Delete event:', event);
    // Show confirmation dialog and delete event
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Check for mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60';

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <SidebarNavigation 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      <main className={`pt-16 ${sidebarWidth} transition-all duration-300 ease-in-out`}>
        <div className="h-screen flex flex-col">
          {/* Desktop View */}
          {!isMobile ? (
            <>
              {/* Breadcrumb */}
              <div className="px-6 py-4">
                <BreadcrumbTrail />
              </div>

              {/* Calendar Header */}
              <CalendarHeader
                currentDate={currentDate}
                view={view}
                onViewChange={handleViewChange}
                onNavigate={handleNavigate}
                onToday={handleToday}
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              {/* Main Content */}
              <div className="flex-1 flex overflow-hidden">
                <CalendarView
                  view={view}
                  currentDate={currentDate}
                  events={events}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  onEventDrop={handleEventDrop}
                  filters={filters}
                />
                
                <SidePanel
                  selectedDate={selectedDate}
                  events={events}
                  onEventEdit={handleEventEdit}
                  onEventDelete={handleEventDelete}
                />
              </div>
            </>
          ) : (
            /* Mobile View */
            (<MobileCalendarView
              events={events}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onEventEdit={handleEventEdit}
              filters={filters}
            />)
          )}
        </div>
      </main>
      <QuickActionFAB />
    </div>
  );
};

export default ContentCalendar;