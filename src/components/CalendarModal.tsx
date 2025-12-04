import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { CalendarEvent, CalendarModalProps } from "@/types";
import { BOOKMARK_STORAGE_KEYS } from "@/enum/bookmarks";

export const CalendarModal: React.FC<CalendarModalProps> = (
    {
        show,
        onClose
    }
) => {
    const {
        isDark
    } = useTheme();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventDescription, setNewEventDescription] = useState("");

    useEffect(() => {
        if (show) {
            const savedEvents = localStorage.getItem(BOOKMARK_STORAGE_KEYS.CALENDAR_EVENTS);

            if (savedEvents) {
                try {
                    setEvents(JSON.parse(savedEvents));
                } catch (error) {
                    console.error("Failed to load calendar events:", error);
                }
            }

            setSelectedDate(new Date());
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            localStorage.setItem(BOOKMARK_STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
        }
    }, [events, show]);

    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const firstDayIndex = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysArray = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const prevDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i);

        daysArray.push({
            date: prevDay,
            currentMonth: false
        });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const currentDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);

        daysArray.push({
            date: currentDay,
            currentMonth: true
        });
    }

    const remainingDays = 42 - daysArray.length;

    for (let i = 1; i <= remainingDays; i++) {
        const nextDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);

        daysArray.push({
            date: nextDay,
            currentMonth: false
        });
    }

    const formatDate = (date: Date): string => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    };

    const getEventsForDate = (date: Date): CalendarEvent[] => {
        const dateString = formatDate(date);
        return events.filter(event => event.date === dateString);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const handleAddEvent = () => {
        if (selectedDate && newEventTitle.trim()) {
            const newEvent: CalendarEvent = {
                id: Date.now().toString(),
                date: formatDate(selectedDate),
                title: newEventTitle.trim(),
                description: newEventDescription.trim()
            };

            setEvents([...events, newEvent]);
            setNewEventTitle("");
            setNewEventDescription("");
            setShowAddEventModal(false);
            localStorage.setItem(BOOKMARK_STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify([...events, newEvent]));
            window.dispatchEvent(new Event("calendarEventsChanged"));
        }
    };

    const handleDeleteEvent = (eventId: string) => {
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
            localStorage.setItem(BOOKMARK_STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(updatedEvents));
            window.dispatchEvent(new Event("calendarEventsChanged"));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
        setSelectedDate(null);
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
        setSelectedDate(new Date());
    };

    if (!show)
        return null;

    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}>
            <div
                className={`w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl transform transition-all duration-300 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                onClick={e => e.stopPropagation()}>
                <div className="p-5 h-full flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3
                            className={`font-bold text-xl ${isDark ? "text-white" : "text-gray-800"}`}>日期备忘录</h3>
                        <button
                            onClick={onClose}
                            className={`text-xl p-2 rounded-full transition-all duration-300 ${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? "focus:ring-white/30 focus:ring-offset-gray-900" : "focus:ring-blue-500 focus:ring-offset-white"}`}
                            aria-label="关闭">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={prevMonth}
                            className={`p-2 rounded-full transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-gray-100"}`}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <div className="flex items-center gap-4">
                            <h4
                                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                                {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
                            </h4>
                            <button
                                onClick={goToToday}
                                className={`text-sm py-1 px-3 rounded-full transition-colors ${isDark ? "bg-white/20 text-white hover:bg-white/30" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>今天
                                                            </button>
                        </div>
                        <button
                            onClick={nextMonth}
                            className={`p-2 rounded-full transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-gray-100"}`}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 max-h-[calc(90vh-180px)]">
                        <div className="grid grid-cols-7 gap-1 mb-4">
                             {dayNames.map((day, index) => <div
                                 // 为周末表头添加特殊样式
                                 key={index}
                                 className={`text-center py-3 font-medium rounded-t-lg transition-colors ${isDark 
                                    ? index === 0 || index === 6 
                                        ? "text-blue-400 bg-white/5" 
                                        : "text-gray-400 bg-white/5" 
                                    : index === 0 || index === 6 
                                        ? "text-blue-600 bg-gray-50" 
                                        : "text-gray-600 bg-gray-50"}`}>
                                 {day}
                             </div>)}
                            {daysArray.map((
                                {
                                    date,
                                    currentMonth
                                },
                                index
                            ) => {
                                const currentDate = new Date();
                                const isToday = formatDate(date) === formatDate(currentDate);
                                const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);
                                const hasEvents = getEventsForDate(date).length > 0;
                                const dateEvents = getEventsForDate(date);

                                // 获取星期几 (0-6，0是星期日，6是星期六)
                                const dayOfWeek = date.getDay();
                                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                                
                                 return (
                                    <div
                                        key={index}
                                        className={`
                        relative w-full h-20 rounded-xl flex flex-col items-center justify-start p-1 cursor-pointer transition-all duration-300
                        ${!currentMonth ? isDark ? "text-gray-600 opacity-40" : "text-gray-400 opacity-40" : ""}
                        ${isToday ? "ring-2 ring-offset-2 ring-blue-500 font-bold" : ""}
                        ${isSelected ? isDark ? "bg-blue-900/50 text-white shadow-lg shadow-blue-900/30" : "bg-blue-100 text-blue-800 shadow-lg shadow-blue-100" : ""}
                        ${currentMonth && !isSelected ? isDark ? "hover:bg-white/10 hover:shadow-md" : "hover:bg-gray-100 hover:shadow-md" : ""}
                        ${currentMonth && isWeekend && !isSelected ? isDark ? "bg-blue-900/10" : "bg-blue-50" : ""}
                      `}
                                        onClick={() => currentMonth && handleDateSelect(date)}
                                    >
                                        <span
                                            className={`text-sm font-medium ${isSelected ? "font-semibold" : ""} ${isDark ? "text-white" : ""} ${currentMonth && isWeekend ? isDark ? "text-blue-300" : "text-blue-600" : ""}`}>
                                            {date.getDate()}
                                        </span>
                                        {hasEvents && <div className="mt-1 w-full flex flex-col gap-0.5 px-0.5">
                                            {dateEvents.slice(0, 2).map((event, i) => <div
                                                key={i}
                                                className={`text-xs truncate px-1.5 py-0.5 rounded-full transition-all ${isDark ? "bg-white/20 text-white hover:bg-white/30" : "bg-blue-200 text-blue-800 hover:bg-blue-300"}`}>
                                                {event.title}
                                            </div>)}
                                            {dateEvents.length > 2 && <div
                                                className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-600"}`}>+{dateEvents.length - 2}
                                            </div>}
                                        </div>}
                                    </div>
                                );
                            })}
                        </div>
                        {selectedDate && <div
                         className={`p-4 rounded-xl mb-4 shadow-md ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"} border transition-all duration-300`}>
                         <div className="flex justify-between items-center mb-3">
                                <h4 className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}>
                                    {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
                                                                        </h4>
                                <button
                                    onClick={() => setShowAddEventModal(true)}
                                    className={`text-sm py-1 px-3 rounded-full transition-colors ${isDark ? "bg-blue-900/50 text-blue-300 hover:bg-blue-900/70" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}>添加备忘录
                                                                        </button>
                            </div>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                {getEventsForDate(selectedDate).length === 0 ? <div
                                    className={`text-center italic py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>暂无备忘录
                                                                            </div> : getEventsForDate(selectedDate).map(event => <div
                                    key={event.id}
                                    className={`p-3 rounded-xl transition-all hover:shadow-md ${isDark ? "bg-white/10 hover:bg-white/15" : "bg-white/70 hover:bg-white"}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h5 className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}>
                                            {event.title}
                                        </h5>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className={`p-1 rounded-full transition-all ${isDark ? "text-gray-400 hover:text-red-400 hover:bg-red-400/10" : "text-gray-500 hover:text-red-600 hover:bg-red-100"}`}
                                            aria-label="删除">
                                            <i className="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </div>
                                    {event.description && <p className={`text-sm ${isDark ? "text-white" : "text-gray-600"}`}>
                                        {event.description}
                                    </p>}
                                </div>)}
                            </div>
                        </div>}
                    </div>
                    {showAddEventModal && <div
                        className="fixed inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                        <div
                            className={`w-full max-w-md p-5 rounded-xl transform transition-all duration-300 scale-100 ${isDark ? "bg-gray-800 border-white/5" : "bg-white border-gray-100"} shadow-2xl border`}>
                            <h4
                                className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>添加新备忘录
                                                                </h4>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={newEventTitle}
                                    onChange={e => setNewEventTitle(e.target.value)}
                                    placeholder="标题..."
                                    className={`w-full border rounded-lg px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-800 focus:ring-blue-300"}`}
                                    onKeyDown={e => e.key === "Enter" && handleAddEvent()}
                                    autoFocus />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    value={newEventDescription}
                                    onChange={e => setNewEventDescription(e.target.value)}
                                    placeholder="描述（可选）..."
                                    rows={3}
                                    className={`w-full border rounded-lg px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-800 focus:ring-blue-300"}`} />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowAddEventModal(false);
                                        setNewEventTitle("");
                                        setNewEventDescription("");
                                    }}
                                    className={`py-2 px-4 rounded-lg transition-colors ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>取消
                                                                        </button>
                                <button
                                    onClick={handleAddEvent}
                                    className={`py-2 px-4 rounded-lg transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                                    disabled={!newEventTitle.trim()}>添加
                                                                        </button>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
};