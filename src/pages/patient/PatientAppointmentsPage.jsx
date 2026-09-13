import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import { appointmentApi } from '../../api/appointment.api.js';
import { formatDate } from '../../utils/formatDate.js';
import StatusBadge from '../../components/shared/StatusBadge.jsx';

const PatientAppointmentsPage = () => {
  // Fetch appointments list
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', 'patient-list'],
    queryFn: async () => {
      const res = await appointmentApi.getAll();
      return Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.appointments || []);
    },
  });

  const columns = [
    {
      header: 'Consultant Doctor',
      accessor: 'doctorId',
      cell: (row) => row.doctorId?.name || 'Assigned General Doctor',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Scheduled Date & Time',
      accessor: 'scheduledAt',
      cell: (row) => formatDate(row.scheduledAt, 'PPpp'),
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => <span className="capitalize">{row.type}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <PageWrapper title="My Scheduled Appointments">
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="card p-0 overflow-hidden">
            <DataTable
              columns={columns}
              data={appointments}
              isLoading={isLoading}
              emptyMessage="You do not have any scheduled appointments yet."
            />
          </div>
        </div>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default PatientAppointmentsPage;
