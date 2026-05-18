import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarPlus } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import AppointmentCalendar from '../../features/appointments/components/AppointmentCalendar.jsx';
import BookingForm from '../../features/appointments/components/BookingForm.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAppointments } from '../../features/appointments/hooks/useAppointments.js';
import { useUpdateAppointmentStatus } from '../../features/appointments/hooks/useUpdateAppointmentStatus.js';
import useUiStore from '../../store/uiStore.js';

const AppointmentsPage = () => {
  const openModal = useUiStore((s) => s.openModal);
  const closeModal = useUiStore((s) => s.closeModal);

  // Fetch appointments list
  const { data: appointments = [] } = useAppointments();

  // Mutation to update appointment status optimistically
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  return (
    <PageWrapper title="Appointments Center">
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Quick Action Header */}
          <div className="flex justify-between items-center bg-white p-4 border border-surface-border rounded-xl shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Clinic Calendar Grid</h3>
              <p className="text-xs text-slate-400">View and update daily, weekly, and monthly appointments status</p>
            </div>
            <Button onClick={() => openModal('book-appt-modal')} className="gap-2 text-xs py-2 px-3">
              <CalendarPlus className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>

          {/* Interactive Monthly Grid & Day Viewer */}
          <AppointmentCalendar appointments={appointments} onUpdateStatus={updateStatus} />
        </div>

        {/* Schedule/Booking Modal */}
        <Modal id="book-appt-modal" title="Schedule Appointment">
          <BookingForm onSuccess={closeModal} />
        </Modal>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default AppointmentsPage;
