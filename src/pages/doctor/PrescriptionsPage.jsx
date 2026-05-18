import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FilePlus, Search, HelpCircle, FileText, BarChart3, Users, Brain, TrendingUp } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import MedicineBuilder from '../../features/prescriptions/components/MedicineBuilder.jsx';
import DownloadButton from '../../features/prescriptions/components/DownloadButton.jsx';
import { prescriptionSchema } from '../../features/prescriptions/schemas/prescriptionSchema.js';
import { useCreatePrescription } from '../../features/prescriptions/hooks/useCreatePrescription.js';
import { prescriptionApi } from '../../api/prescription.api.js';
import { patientApi } from '../../api/patient.api.js';
import useUiStore from '../../store/uiStore.js';
import { formatDate } from '../../utils/formatDate.js';

const PrescriptionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(true);
  const openModal = useUiStore((s) => s.openModal);
  const closeModal = useUiStore((s) => s.closeModal);
  const { mutate: createPrescription, isPending } = useCreatePrescription();

  // Load prescriptions list
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['prescriptions', searchTerm],
    queryFn: async () => {
      const res = await prescriptionApi.getAll({ search: searchTerm });
      return res.data?.data || [];
    },
  });

  // Load patients list for selection dropdown
  const { data: patients = [] } = useQuery({
    queryKey: ['patients', 'prescription-select'],
    queryFn: async () => {
      const res = await patientApi.getAll();
      return res.data?.data || [];
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: '',
      diagnosis: '',
      medicines: [],
      notes: '',
      followUpDate: '',
      isUrdu: false,
    },
  });

  // Hydrate form if there is a draft in sessionStorage
  useEffect(() => {
    const draft = sessionStorage.getItem('prescription_medicines_draft');
    if (draft) {
      try {
        setValue('medicines', JSON.parse(draft));
      } catch (e) {
        console.error('Error hydrating medicines draft', e);
      }
    }
  }, [setValue]);

  const onSubmit = (data) => {
    createPrescription(data, {
      onSuccess: () => {
        sessionStorage.removeItem('prescription_medicines_draft');
        reset();
        closeModal();
      },
    });
  };

  const columns = [
    {
      header: 'Patient Name',
      accessor: 'patientId',
      cell: (row) => row.patientId?.name || 'Unknown Patient',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Diagnosis',
      accessor: 'diagnosis',
    },
    {
      header: 'Date Prescribed',
      accessor: 'createdAt',
      cell: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => <DownloadButton prescriptionId={row._id} />,
    },
  ];

  const totalPrescriptions = prescriptions.length;
  const uniquePatients = new Set(prescriptions.map(p => p.patientId?._id || p.patientId?.name || p.patientId)).size;
  const urduTranslations = prescriptions.filter(p => p.isUrdu).length;
  
  // Calculate top diagnosis
  const commonDiagnosis = prescriptions.length > 0 
    ? prescriptions.reduce((acc, curr) => {
        if (curr.diagnosis) {
          acc[curr.diagnosis] = (acc[curr.diagnosis] || 0) + 1;
        }
        return acc;
      }, {})
    : {};
  const topDiagnosis = Object.entries(commonDiagnosis).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <PageWrapper title="Prescriptions Center">
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Analytics Cards Block */}
          {showStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-5 border border-surface-border rounded-xl bg-white shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Prescriptions Issued</span>
                  <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">{totalPrescriptions}</h3>
                  <span className="text-[10px] text-indigo-500 font-semibold mt-1 block">Total clinical records</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-500">
                  <FileText className="h-6 w-6" />
                </div>
              </div>

              <div className="p-5 border border-surface-border rounded-xl bg-white shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Patients Prescribed</span>
                  <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">{uniquePatients}</h3>
                  <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Unique patients served</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-500">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="p-5 border border-surface-border rounded-xl bg-white shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">AI Urdu Translations</span>
                  <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">{urduTranslations}</h3>
                  <span className="text-[10px] text-amber-500 font-semibold mt-1 block">Native compliance active</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-500">
                  <Brain className="h-6 w-6" />
                </div>
              </div>

              <div className="p-5 border border-surface-border rounded-xl bg-white shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Top Condition</span>
                  <h3 className="text-lg font-bold font-display text-slate-800 mt-2 truncate max-w-[150px]" title={topDiagnosis}>{topDiagnosis}</h3>
                  <span className="text-[10px] text-violet-500 font-semibold mt-1 block">Most frequent diagnosis</span>
                </div>
                <div className="p-3 bg-violet-50 border border-violet-100 rounded-lg text-violet-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>
          )}

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 border border-surface-border rounded-xl shadow-sm">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search prescriptions by patient name..."
                className="input-field pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 self-stretch sm:self-auto">
              <Button 
                variant="secondary" 
                onClick={() => setShowStats(!showStats)} 
                className="gap-2 shrink-0 flex-1 sm:flex-none justify-center"
              >
                <BarChart3 className="h-4 w-4 text-slate-500" />
                {showStats ? 'Hide Analytics' : 'View Analytics'}
              </Button>

              <Button onClick={() => openModal('create-prescription-modal')} className="gap-2 shrink-0 flex-1 sm:flex-none justify-center">
                <FilePlus className="h-4 w-4" />
                New Prescription
              </Button>
            </div>
          </div>

          {/* Table List */}
          <div className="card p-0 overflow-hidden">
            <DataTable
              columns={columns}
              data={prescriptions}
              isLoading={isLoading}
              emptyMessage="No prescriptions recorded yet."
            />
          </div>
        </div>

        {/* Create Prescription Modal */}
        <Modal id="create-prescription-modal" title="Write New Prescription">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Select Patient</label>
              <select className="input-field" {...register('patientId')}>
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.patientId && <p className="error-text">{errors.patientId.message}</p>}
            </div>

            <Input
              label="Diagnosis"
              placeholder="e.g. Hypertension, Seasonal Influenza"
              error={errors.diagnosis}
              {...register('diagnosis')}
            />

            {/* Dynamic Medicines Row Builder */}
            <MedicineBuilder control={control} register={register} errors={errors} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Follow Up Date"
                type="date"
                error={errors.followUpDate}
                {...register('followUpDate')}
              />

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2.5 p-3.5 border border-surface-border bg-slate-50/50 rounded-lg text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-primary-500 border-surface-border focus:ring-primary-500 h-4 w-4"
                    {...register('isUrdu')}
                  />
                  Translate AI Explanation to Urdu (اردو)
                </label>
              </div>
            </div>

            <Input
              label="Additional Notes / Advice"
              placeholder="e.g. Drink plenty of water and avoid cold drinks."
              error={errors.notes}
              {...register('notes')}
            />

            <Button type="submit" isLoading={isPending} className="w-full mt-6">
              Generate & Print Prescription
            </Button>
          </form>
        </Modal>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default PrescriptionsPage;
