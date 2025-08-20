import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeeklyCalendarWidget = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const scheduledPosts = [
    {
      id: 1,
      title: "Dicas de produtividade para profissionais",
      time: "09:00",
      date: "2025-08-11",
      type: "text",
      status: "scheduled"
    },
    {
      id: 2,
      title: "Análise de mercado Q3 2025",
      time: "14:30",
      date: "2025-08-12",
      type: "carousel",
      status: "scheduled"
    },
    {
      id: 3,
      title: "Webinar sobre inovação digital",
      time: "16:00",
      date: "2025-08-13",
      type: "video",
      status: "scheduled"
    },
    {
      id: 4,
      title: "Reflexões sobre liderança",
      time: "11:15",
      date: "2025-08-14",
      type: "image",
      status: "scheduled"
    }
  ];

  const getWeekDays = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek?.getDay();
    const diff = startOfWeek?.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek?.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date?.setDate(startOfWeek?.getDate() + i);
      days?.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const today = new Date()?.toDateString();

  const getPostsForDate = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return scheduledPosts?.filter(post => post?.date === dateStr);
  };

  const getPostTypeIcon = (type) => {
    const icons = {
      text: 'FileText',
      image: 'Image',
      video: 'Video',
      carousel: 'Images'
    };
    return icons?.[type] || 'FileText';
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate?.setDate(newDate?.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatWeekDay = (date) => {
    return date?.toLocaleDateString('pt-BR', { weekday: 'short' });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Calendário Semanal</h3>
          <p className="text-sm text-muted-foreground">
            {weekDays?.[0]?.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigateWeek(-1)}>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigateWeek(1)}>
            <Icon name="ChevronRight" size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/content-calendar')}
            iconName="Calendar"
            iconPosition="left"
          >
            Ver Completo
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays?.map((day, index) => {
          const isToday = day?.toDateString() === today;
          const dayPosts = getPostsForDate(day);

          return (
            <div key={index} className="min-h-24">
              <div className={`text-center p-2 rounded-lg mb-2 ${
                isToday ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
              }`}>
                <div className="text-xs font-medium">
                  {formatWeekDay(day)}
                </div>
                <div className={`text-sm font-bold ${isToday ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {formatDate(day)?.split('/')?.[0]}
                </div>
              </div>
              <div className="space-y-1">
                {dayPosts?.map((post) => (
                  <div
                    key={post?.id}
                    className="bg-primary/10 text-primary p-2 rounded text-xs cursor-pointer hover:bg-primary/20 transition-colors duration-150"
                    title={post?.title}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <Icon name={getPostTypeIcon(post?.type)} size={12} />
                      <span className="font-medium">{post?.time}</span>
                    </div>
                    <div className="truncate text-xs">
                      {post?.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {scheduledPosts?.length} posts agendados esta semana
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/post-creation')}
            iconName="Plus"
            iconPosition="left"
          >
            Novo Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendarWidget;