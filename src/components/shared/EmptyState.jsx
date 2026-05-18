import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 card text-center border-dashed">
      <Inbox className="h-12 w-12 text-slate-300 mb-3" />
      <p className="text-sm font-semibold text-slate-600">{message || 'No data available'}</p>
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
  );
};

export default EmptyState;
