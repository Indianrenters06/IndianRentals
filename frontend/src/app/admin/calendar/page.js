'use client';

import { useState, useEffect } from 'react';
import {
    FiChevronLeft, FiChevronRight, FiPlus, FiCalendar,
    FiClock, FiMapPin, FiUser, FiPackage
} from 'react-icons/fi';

export default function CalendarManagement() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState('month'); // month, week, day

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/calendar', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getEventsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.date?.startsWith(dateStr));
    };

    const renderCalendarDays = () => {
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square p-2 border border-gray-100 bg-gray-50"></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDate(day);
            const isToday = new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

            days.push(
                <div
                    key={day}
                    className={`aspect-square p-2 border border-gray-100 hover:bg-indigo-50 cursor-pointer transition-colors ${isToday ? 'bg-indigo-100 border-indigo-300' : 'bg-white'
                        }`}
                    onClick={() => setSelectedDate(day)}
                >
                    <div className="flex flex-col h-full">
                        <span className={`text-sm font-semibold mb-1 ${isToday ? 'text-indigo-700' : 'text-gray-700'}`}>
                            {day}
                        </span>
                        <div className="flex-1 overflow-hidden">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                                <div
                                    key={idx}
                                    className="text-xs bg-indigo-600 text-white rounded px-1 py-0.5 mb-1 truncate"
                                    title={event.title}
                                >
                                    {event.title || 'Event'}
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage rental schedules and events</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                <FiPlus className="w-4 h-4" />
                                New Event
                            </button>
                        </div>
                    </div>

                    {/* Calendar Controls */}
                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={previousMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setView('month')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setView('week')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setView('day')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Day
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Day Names Header */}
                    <div className="grid grid-cols-7 border-b border-gray-200">
                        {dayNames.map(day => (
                            <div key={day} className="py-3 px-2 text-center text-sm font-semibold text-gray-600 bg-gray-50">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                        {renderCalendarDays()}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Rentals & Events</h3>
                    <div className="space-y-3">
                        {events.slice(0, 5).map((event, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="p-3 bg-indigo-100 rounded-lg">
                                    <FiCalendar className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{event.title || 'Rental Booking'}</h4>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <FiClock className="w-4 h-4" />
                                            <span>{new Date(event.date || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiUser className="w-4 h-4" />
                                            <span>{event.customer?.name || 'Customer'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiPackage className="w-4 h-4" />
                                            <span>{event.product?.name || 'Product'}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                    Confirmed
                                </span>
                            </div>
                        ))}

                        {events.length === 0 && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCalendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                                <p className="text-gray-600">Schedule your first rental or event</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
