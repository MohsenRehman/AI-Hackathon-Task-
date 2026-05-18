import React from 'react';
import { FileText, Calendar, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate.js';

const MedicalHistoryTimeline = ({ prescriptions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No medical history found for this patient.
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
      {prescriptions.map((p, idx) => (
        <div key={idx} className="relative">
          {/* Dot */}
          <span className="absolute -left-[31px] top-1.5 bg-primary-500 text-white rounded-full p-1 border-4 border-white shadow-sm">
            <FileText className="h-3 w-3" />
          </span>

          <div>
            <span className="text-xs text-slate-400 font-medium">
              {formatDate(p.createdAt, 'PPP')}
            </span>
            <h4 className="text-sm font-bold text-slate-800 mt-0.5">
              Diagnosis: {p.diagnosis}
            </h4>
            {p.medicines && p.medicines.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-xs font-semibold text-slate-500">Prescribed Medicines:</span>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                  {p.medicines.map((m, mIdx) => (
                    <li key={mIdx}>
                      {m.name} — {m.dosage} ({m.frequency}, {m.duration})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {p.notes && (
              <p className="text-xs text-slate-500 italic mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                Notes: {p.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicalHistoryTimeline;
