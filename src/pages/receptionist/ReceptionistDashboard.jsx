import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, UserPlus, PhoneCall, CheckCircle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAppointments } from '../../features/appointments/hooks/useAppointments.js';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { data: appointments = [], isLoading } = useAppointments();

  const todayCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <PageWrapper title="Receptionist Desk">
      <ErrorBoundary>
        <div className="space-y-8">
          {/* Action blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center space-y-4">
              <div className="mx-auto h-12 w-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold font-display text-slate-800">Schedule Center</h4>
                <p className="text-xs text-slate-500 mt-1">Book or cancel clinic appointments</p>
              </div>
              <Button onClick={() => navigate('/receptionist/appointments')} className="w-full text-xs">
                Open Calendar
              </Button>
            </div>

            <div className="card text-center space-y-4">
              <div className="mx-auto h-12 w-12 bg-emerald-50 text-medical-green rounded-xl flex items-center justify-center">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold font-display text-slate-800">Register Patient</h4>
                <p className="text-xs text-slate-500 mt-1">Add new patient context to directory</p>
              </div>
              <Button onClick={() => navigate('/doctor/patients')} className="w-full text-xs" variant="secondary">
                Register Patients
              </Button>
            </div>

            <div className="card bg-slate-900 border-0 text-white flex flex-col justify-between p-6">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Desk Metrics</span>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                  <div>
                    <span className="text-xs text-slate-500">Today's bookings</span>
                    <p className="text-2xl font-bold font-display text-white mt-1">{todayCount}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Pending status</span>
                    <p className="text-2xl font-bold font-display text-medical-amber mt-1">{pendingCount}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/receptionist/appointments')}
                className="w-full mt-6 btn-primary bg-primary-500 hover:bg-primary-600 text-white text-xs border-0 py-2.5 font-bold"
              >
                Launch Grid
              </button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default ReceptionistDashboard;
