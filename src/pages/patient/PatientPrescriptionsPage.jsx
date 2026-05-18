import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FileText, Sparkles, MessageCircle, HelpCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import DownloadButton from '../../features/prescriptions/components/DownloadButton.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { prescriptionApi } from '../../api/prescription.api.js';
import { diagnosisApi } from '../../api/diagnosis.api.js';
import useUiStore from '../../store/uiStore.js';
import { formatDate } from '../../utils/formatDate.js';

const PatientPrescriptionsPage = () => {
  const openModal = useUiStore((s) => s.openModal);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [explanationLanguage, setExplanationLanguage] = useState('en');

  // Load prescriptions list
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['prescriptions', 'patient-list'],
    queryFn: async () => {
      const res = await prescriptionApi.getAll();
      return res.data?.data?.prescriptions || [];
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
    openModal('ai-explanation-modal');
    explainPrescription({ id: pres._id, lang });
  };

  const columns = [
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

  return (
    <PageWrapper title="My Prescriptions">
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="card p-0 overflow-hidden">
            <DataTable
              columns={columns}
              data={prescriptions}
              isLoading={isLoading}
              emptyMessage="You do not have any prescriptions recorded yet."
            />
          </div>
        </div>

        {/* AI Explanation Modal */}
        <Modal id="ai-explanation-modal" title="Clinical AI Assistant">
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

export default PatientPrescriptionsPage;
