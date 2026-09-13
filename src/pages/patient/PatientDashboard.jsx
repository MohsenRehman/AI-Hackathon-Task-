import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Calendar, FileText, Heart, ShieldAlert, Sparkles, 
  HelpCircle, User, Mail, ShieldCheck, Zap, Activity
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import Button from '../../components/ui/Button.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import DownloadButton from '../../features/prescriptions/components/DownloadButton.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePlan } from '../../hooks/usePlan.js';
import { appointmentApi } from '../../api/appointment.api.js';
import { prescriptionApi } from '../../api/prescription.api.js';
import { diagnosisApi } from '../../api/diagnosis.api.js';
import useUiStore from '../../store/uiStore.js';
import { formatDate } from '../../utils/formatDate.js';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { planName } = usePlan();
  const openModal = useUiStore((s) => s.openModal);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [explanationLanguage, setExplanationLanguage] = useState('en');

  // Load appointments list
  const { data: appointments = [], isLoading: isLoadingAppts } = useQuery({
    queryKey: ['appointments', 'patient-dashboard'],
    queryFn: async () => {
      const res = await appointmentApi.getAll();
      return Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.appointments || []);
    },
  });

  // Load prescriptions list
  const { data: prescriptions = [], isLoading: isLoadingPrescriptions } = useQuery({
    queryKey: ['prescriptions', 'patient-dashboard'],
    queryFn: async () => {
      const res = await prescriptionApi.getAll();
      return Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.prescriptions || []);
    },
  });

  // AI explanation query
  const { mutate: explainPrescription, data: aiExplanation, isPending: isExplaining } = useMutation({
    mutationFn: async ({ id, lang }) => {
      const res = await diagnosisApi.explainPrescription(id, lang === 'ur');
      return res.data?.data;
    },
  });

  const handleAskAI = (pres, lang) => {
    setSelectedPrescription(pres);
    setExplanationLanguage(lang);
    openModal('patient-ai-modal');
    explainPrescription({ id: pres._id, lang });
  };

  const prescriptionColumns = [
    {
      header: 'Diagnosis',
      accessor: 'diagnosis',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Medicines Count',
      accessor: 'medicines',
      cell: (row) => `${row.medicines?.length || 0} items`,
    },
    {
      header: 'Prescribed Date',
      accessor: 'createdAt',
      cell: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Actions',
      accessor: '_id',
      cell: (row) => (
        <div className="flex gap-2">
          <DownloadButton prescriptionId={row._id} />
          
          <Button
            variant="ghost"
            className="py-1 px-2.5 text-xs text-primary-500 hover:bg-primary-50 gap-1.5"
            onClick={() => handleAskAI(row, 'en')}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Explain
          </Button>

          <Button
            variant="ghost"
            className="py-1 px-2.5 text-xs text-medical-amber hover:bg-amber-50 gap-1.5 font-urdu"
            onClick={() => handleAskAI(row, 'ur')}
          >
            <Sparkles className="h-3.5 w-3.5" />
            وضاحت
          </Button>
        </div>
      ),
    },
  ];

  const appointmentColumns = [
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
    <PageWrapper title="Patient Dashboard">
      <ErrorBoundary>
        <div className="space-y-8">
          
          {/* Welcome greeting banner */}
          <div className="card bg-gradient-to-r from-teal-600 via-emerald-500 to-emerald-600 text-white border-0 shadow-lg p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white/90">
                ACTIVE PATIENT PORTAL
              </span>
              <h2 className="text-2xl font-bold font-display tracking-tight">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-xs text-white/80 max-w-lg">
                Access your digital prescriptions, clinical AI translator tools, and appointment histories on our secure patient dashboard.
              </p>
            </div>
            <div className="flex gap-3 shrink-0 relative z-10">
              <Button 
                onClick={() => navigate('/patient/appointments')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs gap-1.5"
              >
                <Calendar className="h-4 w-4" />
                Schedules
              </Button>
              <Button 
                onClick={() => navigate('/patient/prescriptions')}
                className="bg-white text-emerald-600 hover:bg-slate-50 border-0 text-xs gap-1.5 shadow-md"
              >
                <FileText className="h-4 w-4 text-emerald-500" />
                Prescriptions
              </Button>
            </div>
            
            {/* Background elements */}
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-white/5 translate-x-20 translate-y-20 blur-xl"></div>
          </div>

          {/* Profile Card & KPI Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 👤 Patient Profile Card */}
            <div className="card border border-surface-border bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white rounded-full flex items-center justify-center font-bold font-display text-2xl border-4 border-emerald-50 shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 font-display">{user?.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50 mt-1 inline-block">
                      Patient Account
                    </span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-xs">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Email Address</span>
                      <span className="text-slate-700 font-medium truncate block">{user?.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-xs">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Gender</span>
                        <span className="text-slate-700 font-medium capitalize">{user?.gender || 'Male'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Age</span>
                        <span className="text-slate-700 font-medium">{user?.age || '28'} Y/O</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Security Guard</span>
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  Verified
                </span>
              </div>
            </div>

            {/* Statistics KPIs */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card p-5 border border-surface-border bg-white shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Total Prescriptions</span>
                    <h3 className="text-3xl font-bold font-display text-slate-800 mt-1">{prescriptions.length}</h3>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-500">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-[10px] text-teal-500 font-semibold block mt-4">
                  Fully compiled digital logs
                </span>
              </div>

              <div className="card p-5 border border-surface-border bg-white shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Scheduled Schedules</span>
                    <h3 className="text-3xl font-bold font-display text-slate-800 mt-1">{appointments.length}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-[10px] text-emerald-500 font-semibold block mt-4">
                  Consultation appointments recorded
                </span>
              </div>

              <div className="card sm:col-span-2 bg-slate-900 border-0 text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-xs text-primary-400 font-extrabold uppercase tracking-wide">
                    <Zap className="h-4 w-4 animate-bounce" />
                    AI Health Core Engaged
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed max-w-md">
                    Translate your complex diagnostic plans into native Urdu scripts instantly to get a clearer picture of your medicine compliance instructions.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/patient/prescriptions')}
                  className="bg-primary-500 hover:bg-primary-600 text-white border-0 text-xs shrink-0 self-stretch sm:self-auto"
                >
                  Ask Clinical Assistant
                </Button>
              </div>
            </div>
          </div>

          {/* 📄 Prescriptions History Registry */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              Prescriptions & AI Assistant
            </h3>
            <div className="card p-0 overflow-hidden">
              <DataTable
                columns={prescriptionColumns}
                data={prescriptions}
                isLoading={isLoadingPrescriptions}
                emptyMessage="You do not have any prescriptions recorded yet."
              />
            </div>
          </div>

          {/* 📅 Appointments Log */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              Appointment History
            </h3>
            <div className="card p-0 overflow-hidden">
              <DataTable
                columns={appointmentColumns}
                data={appointments}
                isLoading={isLoadingAppts}
                emptyMessage="You do not have any scheduled appointments logged yet."
              />
            </div>
          </div>

        </div>

        {/* AI Explanation Modal */}
        <Modal id="patient-ai-modal" title="Clinical AI Assistant">
          <div className="space-y-4">
            {isExplaining ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <Spinner size="md" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {explanationLanguage === 'ur' ? 'پریسکرپشن کی وضاحت ہو رہی ہے...' : 'Analyzing prescription metrics...'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {explanationLanguage === 'ur' 
                      ? 'مصنوعی ذہانت پریسکرپشن کا مطالعہ کر رہی ہے' 
                      : 'Clinical models translating and generating health insights...'}
                  </p>
                </div>
              </div>
            ) : aiExplanation ? (
              <div className={`space-y-4 ${explanationLanguage === 'ur' ? 'text-right font-urdu' : ''}`}>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {explanationLanguage === 'ur' ? 'خلاصہ' : 'Simple Summary'}
                  </span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {aiExplanation.simpleSummary}
                  </p>
                </div>

                <div className="p-4 border border-surface-border bg-white rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {explanationLanguage === 'ur' ? 'طرز زندگی کا مشورہ' : 'Lifestyle & Safety Advice'}
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2 list-inside list-disc">
                    {aiExplanation.lifestyleAdvice?.map((adv, idx) => (
                      <li key={idx} className="leading-relaxed">{adv}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 border border-surface-border bg-white rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {explanationLanguage === 'ur' ? 'احتیاطی تدابیر' : 'Preventive Tips'}
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2 list-inside list-disc">
                    {aiExplanation.preventiveTips?.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg text-[10px] text-slate-400 leading-relaxed">
                  <HelpCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {explanationLanguage === 'ur' 
                      ? 'یہ ایک مصنوعی ذہانت سے تیار کردہ تجزیہ ہے۔ اپنے معالج کے مشورے کو ترجیح دیں۔'
                      : 'This is an AI-generated explanation for support. Always prioritize direct consultation with your practitioner.'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">Could not generate translation. Please try again.</p>
            )}
          </div>
        </Modal>

      </ErrorBoundary>
    </PageWrapper>
  );
};

export default PatientDashboard;
