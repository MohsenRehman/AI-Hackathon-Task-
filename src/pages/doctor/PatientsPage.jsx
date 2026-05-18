import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Calendar, UserPlus } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import PatientForm from '../../features/patients/components/PatientForm.jsx';
import { patientApi } from '../../api/patient.api.js';
import useUiStore from '../../store/uiStore.js';
import { formatDate } from '../../utils/formatDate.js';

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const openModal = useUiStore((s) => s.openModal);
  const closeModal = useUiStore((s) => s.closeModal);

  // Load patients list
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      const res = await patientApi.getAll({ search: searchTerm });
      return res.data?.data || [];
    },
  });

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Age',
      accessor: 'age',
    },
    {
      header: 'Gender',
      accessor: 'gender',
      cell: (row) => <span className="capitalize">{row.gender}</span>,
    },
    {
      header: 'Phone Number',
      accessor: 'phone',
      cell: (row) => row.contact?.phone || 'No Phone',
    },
    {
      header: 'Registered Date',
      accessor: 'createdAt',
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <PageWrapper title="Patients Directory">
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 border border-surface-border rounded-xl shadow-sm">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients by name or phone..."
                className="input-field pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button onClick={() => openModal('add-patient-modal')} className="gap-2 shrink-0">
              <UserPlus className="h-4 w-4" />
              Register Patient
            </Button>
          </div>

          {/* Patients Data Table */}
          <div className="card p-0 overflow-hidden">
            <DataTable
              columns={columns}
              data={patients}
              isLoading={isLoading}
              emptyMessage="No patients found matching the criteria."
            />
          </div>
        </div>

        {/* Modal Wrapper for adding patient */}
        <Modal id="add-patient-modal" title="Register New Patient">
          <PatientForm onSuccess={closeModal} />
        </Modal>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default PatientsPage;
