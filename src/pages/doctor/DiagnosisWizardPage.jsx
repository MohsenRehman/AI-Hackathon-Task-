import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import SymptomWizard from '../../features/ai-diagnosis/components/SymptomWizard.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';

const DiagnosisWizardPage = () => {
  return (
    <PageWrapper title="AI Symptom Checker & Diagnostic Assistant">
      <ErrorBoundary>
        <SymptomWizard />
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default DiagnosisWizardPage;
