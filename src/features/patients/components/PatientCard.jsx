import React from 'react';
import { User, Phone, Calendar } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate.js';

const PatientCard = ({ patient, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="card-hover flex items-start gap-4"
    >
      <div className="p-3 bg-primary-50 text-primary-500 rounded-lg">
        <User className="h-6 w-6" />
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="text-base font-semibold font-display text-slate-800 truncate mb-1">
          {patient.name}
        </h4>
        <div className="space-y-1 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {patient.age} yrs • <span className="capitalize">{patient.gender}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {patient.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
