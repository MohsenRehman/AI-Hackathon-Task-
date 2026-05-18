import React from 'react';
import { Clock, User, Phone, Video, MapPin } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatDate.js';
import StatusBadge from '../../../components/shared/StatusBadge.jsx';

const AppointmentCard = ({ appt, onUpdateStatus }) => {
  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-50 text-primary-500 rounded-lg">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-bold font-display text-slate-800">
              {appt.patient?.name}
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {appt.patient?.phone}
            </p>
          </div>
        </div>
        <StatusBadge status={appt.status} />
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          Scheduled: <span className="font-semibold text-slate-700">{formatDateTime(appt.scheduledAt)}</span>
        </p>
        <p className="flex items-center gap-2">
          {appt.type === 'telemedicine' ? (
            <>
              <Video className="h-4 w-4 text-medical-blue" />
              Type: <span className="font-semibold text-medical-blue uppercase">Telemedicine</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-medical-green" />
              Type: <span className="font-semibold text-medical-green uppercase">In-Person Clinic</span>
            </>
          )}
        </p>
        <p className="text-xs text-slate-400">
          Duration: {appt.duration} minutes
        </p>
      </div>

      {onUpdateStatus && appt.status !== 'completed' && appt.status !== 'cancelled' && (
        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
          <span className="text-slate-400">Quick Actions:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdateStatus({ id: appt._id, status: 'confirmed' })}
              className="btn-secondary py-1 px-2.5 text-xs text-primary-500 border-primary-200 hover:bg-primary-50"
            >
              Confirm
            </button>
            <button 
              onClick={() => onUpdateStatus({ id: appt._id, status: 'cancelled' })}
              className="btn-secondary py-1 px-2.5 text-xs text-medical-red border-red-200 hover:bg-red-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
