import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, BrainCircuit, ArrowLeft, ArrowRight, UserCheck, Stethoscope } from 'lucide-react';
import { patientApi } from '../../../api/patient.api.js';
import { useAIDiagnosis } from '../hooks/useAIDiagnosis.js';
import DiagnosisResult from './DiagnosisResult.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

const SymptomWizard = () => {
  const [step, setStep] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [notes, setNotes] = useState('');
  
  const { mutate: runAIDiagnosis, data: diagnosisResult, isPending } = useAIDiagnosis();

  // Load patients
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients', 'wizard-select'],
    queryFn: async () => {
      const res = await patientApi.getAll();
      return res.data?.data || [];
    },
  });

  const selectedPatient = patients.find((p) => p._id === selectedPatientId);

  const addSymptom = () => {
    const trimmed = currentSymptom.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (s) => {
    setSymptoms(symptoms.filter((item) => item !== s));
  };

  const handleRunDiagnosis = () => {
    if (!selectedPatientId || symptoms.length === 0) return;
    setStep(3); // Go to loading screen

    runAIDiagnosis({
      patientId: selectedPatientId,
      symptoms,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      medicalHistory: notes ? [notes] : [],
    }, {
      onSuccess: () => {
        setStep(4); // Go to result screen
      },
      onError: () => {
        setStep(2); // Go back to symptom input
      }
    });
  };

  const handleReset = () => {
    setSelectedPatientId('');
    setSymptoms([]);
    setNotes('');
    setStep(1);
  };

  const stepsInfo = [
    { title: 'Select Patient', desc: 'Identify the patient for diagnostic context' },
    { title: 'Enter Symptoms', desc: 'Detail the current clinical observations' },
    { title: 'AI Analysis', desc: 'Processing diagnosis' },
    { title: 'Diagnostic Report', desc: 'Clinical insights & recommendations' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Step Progress Indicators */}
      <div className="flex justify-between items-center bg-white border border-surface-border rounded-xl p-4 shadow-sm">
        {stepsInfo.map((sInfo, idx) => {
          const stepNum = idx + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center border transition-all duration-300 ${
                isCompleted ? 'bg-medical-green text-white border-medical-green' :
                isActive ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20' :
                'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                {stepNum}
              </span>
              <div className="hidden md:block text-left">
                <p className={`text-xs font-bold leading-none ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{sInfo.title}</p>
              </div>
              {idx < 3 && <span className="hidden md:block h-px w-8 bg-slate-100 mx-2"></span>}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Patient Context Select */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-50 text-primary-500 rounded-xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-800">Identify Patient</h3>
                <p className="text-xs text-slate-500">Provide the baseline demographic details of the patient</p>
              </div>
            </div>

            <div>
              <label className="label">Search/Choose Patient</label>
              <select
                className="input-field"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                disabled={isLoadingPatients}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.contact?.phone || 'No Phone'})
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-3 gap-4 text-center"
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Patient Name</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{selectedPatient.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Age</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{selectedPatient.age} yrs</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Gender</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5 capitalize">{selectedPatient.gender}</p>
                </div>
              </motion.div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                disabled={!selectedPatientId}
                onClick={() => setStep(2)}
                className="gap-2"
              >
                Proceed
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Symptom Tags Input */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-50 text-primary-500 rounded-xl">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-800">Detail Symptoms</h3>
                <p className="text-xs text-slate-500">Add current patient symptoms and optional medical notes</p>
              </div>
            </div>

            {/* Input tag box */}
            <div className="space-y-3">
              <label className="label">Enter Symptom & Click Add</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Shortness of breath, dry cough"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                />
                <Button type="button" onClick={addSymptom} variant="secondary" className="px-4">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Tag bubble area */}
              {symptoms.length > 0 ? (
                <div className="flex gap-1.5 flex-wrap p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  {symptoms.map((s) => (
                    <span 
                      key={s} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100"
                    >
                      {s}
                      <button type="button" onClick={() => removeSymptom(s)} className="text-primary-400 hover:text-primary-600">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Please add at least 1 symptom to proceed.</p>
              )}
            </div>

            {/* Optional notes */}
            <div>
              <label className="label">Optional Medical History / Notes</label>
              <textarea
                rows={3}
                placeholder="Detail any previous history or notes..."
                className="input-field"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                disabled={symptoms.length === 0}
                onClick={handleRunDiagnosis}
                className="gap-2"
              >
                Run AI Diagnosis
                <BrainCircuit className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Loader overlay */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card flex flex-col items-center justify-center py-20 text-center space-y-6"
          >
            <div className="relative">
              <div className="h-16 w-16 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center animate-pulse">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <span className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-800">Analyzing Symptoms with AI</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Comparing symptoms against clinical models to gauge risk and generate action plans...
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 4: Diagnostic report */}
        {step === 4 && diagnosisResult && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 animate-fade-in"
          >
            <div className="card flex items-center justify-between border-emerald-100 bg-emerald-50/10">
              <div>
                <h3 className="text-base font-bold font-display text-slate-800">AI Diagnostic Complete</h3>
                <p className="text-xs text-slate-400">Successfully generated clinical insights for {selectedPatient?.name}</p>
              </div>
              <Button onClick={handleReset} variant="secondary" className="text-xs py-1 px-3">
                Reset Checker
              </Button>
            </div>

            <DiagnosisResult diagnosisLog={diagnosisResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SymptomWizard;
