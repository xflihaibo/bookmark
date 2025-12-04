import { useState, useEffect } from 'react';
import { BOOKMARK_STORAGE_KEYS } from "@/enum/bookmarks";

export function useDateTime() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [hasTodayEvents, setHasTodayEvents] = useState(false);

  useEffect(() => {
    // 更新日期和时间
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
      
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const date = now.getDate().toString().padStart(2, "0");
      const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
      const dayOfWeek = dayNames[now.getDay()];
      setCurrentDate(`${year}-${month}-${date} 星期${dayOfWeek}`);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    
    // 检查今天是否有日历事件
    const checkTodayEvents = () => {
      try {
        // 获取今天的日期字符串，格式为 YYYY-MM-DD
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        // 从localStorage获取日历事件
        const savedEvents = localStorage.getItem(BOOKMARK_STORAGE_KEYS.CALENDAR_EVENTS);
        if (savedEvents) {
            const events = JSON.parse(savedEvents);
            // 检查是否有今天的事件
            const hasEvents = events.some((event: any) => event.date === todayStr);
            setHasTodayEvents(hasEvents);
        } else {
            setHasTodayEvents(false);
        }
      } catch (error) {
          console.error("Failed to check today's events:", error);
          setHasTodayEvents(false);
      }
    };

    // 组件加载时检查一次
    checkTodayEvents();
    // 每分钟检查一次，确保及时更新
    const calendarIntervalId = setInterval(checkTodayEvents, 60000);
    
    // 监听日历事件变化的自定义事件
    const handleCalendarEventsChanged = () => {
        checkTodayEvents();
    };
    
    window.addEventListener('calendarEventsChanged', handleCalendarEventsChanged);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(calendarIntervalId);
      window.removeEventListener('calendarEventsChanged', handleCalendarEventsChanged);
    };
  }, []);

  return {
    currentTime,
    currentDate,
    hasTodayEvents
  };
}