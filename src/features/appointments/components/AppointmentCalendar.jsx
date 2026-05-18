import React, { useState } from 'react';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  startOfWeek, endOfWeek, isSameDay, isToday, addMonths, subMonths, parseISO 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { cn } from '../../../utils/cn.js';
import StatusBadge from '../../../components/shared/StatusBadge.jsx';

const AppointmentCalendar = ({ appointments, onUpdateStatus }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day) => {
    return appointments.filter((appt) => {
      const apptDate = parseISO(appt.scheduledAt);
      return isSameDay(apptDate, day);
    });
  };

  const selectedDayAppointments = getAppointmentsForDay(selectedDate);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid Card */}
      <div className="card lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-bold font-display text-slate-800">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="btn-secondary p-2">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={handleNextMonth} className="btn-secondary p-2">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 border-t border-l border-surface-border">
          {days.map((day, idx) => {
            const dayAppts = getAppointmentsForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'h-20 p-2 border-r border-b border-surface-border flex flex-col justify-between cursor-pointer transition-colors relative hover:bg-slate-50',
                  isSelected && 'bg-primary-50/50 hover:bg-primary-50/50',
                  !isCurrentMonth && 'text-slate-300'
                )}
              >
                <span 
                  className={cn(
                    'h-6 w-6 text-xs font-semibold flex items-center justify-center rounded-full',
                    isToday(day) && 'bg-primary-500 text-white font-bold',
                    isSelected && !isToday(day) && 'bg-slate-200 text-slate-800'
                  )}
                >
                  {format(day, 'd')}
                </span>

                {/* Appointment dots */}
                <div className="flex gap-1 flex-wrap mt-1 overflow-hidden max-h-6">
                  {dayAppts.slice(0, 3).map((appt, apptIdx) => {
                    const dotColors = {
                      pending: 'bg-medical-amber',
                      confirmed: 'bg-primary-500',
                      completed: 'bg-medical-green',
                      cancelled: 'bg-medical-red',
                    };
                    return (
                      <span 
                        key={apptIdx} 
                        className={cn(
                          'h-1.5 w-1.5 rounded-full', 
                          dotColors[appt.status?.toLowerCase()] || 'bg-slate-400'
                        )}
                      />
                    );
                  })}
                  {dayAppts.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-bold leading-none">+{dayAppts.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments Side Panel */}
      <div className="card flex flex-col h-[500px]">
        <div className="border-b border-surface-border pb-4 mb-4">
          <span className="text-xs text-slate-400 font-bold uppercase">Schedule for</span>
          <h3 className="text-base font-bold font-display text-slate-800 mt-0.5">
            {format(selectedDate, 'eeee, MMMM d, yyyy')}
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-1">
          {selectedDayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Clock className="h-8 w-8 stroke-1.5 mb-2 text-slate-300" />
              <p className="text-sm font-medium">No appointments today</p>
            </div>
          ) : (
            selectedDayAppointments.map((appt, idx) => (
              <div key={idx} className="p-3 border border-surface-border rounded-xl bg-slate-50 space-y-2 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-primary-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(appt.scheduledAt), 'hh:mm a')} ({appt.duration} min)
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-1">
                      <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      {appt.patient?.name}
                    </h4>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
                  <span className="capitalize">Type: {appt.type}</span>
                  {onUpdateStatus && appt.status !== 'completed' && appt.status !== 'cancelled' && (
                    <select
                      className="bg-transparent border-0 font-semibold text-primary-500 focus:ring-0 p-0 text-xs cursor-pointer"
                      value={appt.status}
                      onChange={(e) => onUpdateStatus({ id: appt._id, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
