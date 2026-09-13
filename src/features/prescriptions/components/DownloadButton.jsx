import React, { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlan } from '../../../hooks/usePlan.js';
import { prescriptionApi } from '../../../api/prescription.api.js';
import useUiStore from '../../../store/uiStore.js';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import UpgradePrompt from '../../../components/shared/UpgradePrompt.jsx';

import useAuthStore from '../../../store/authStore.js';
import { API_BASE_URL } from '../../../api/axios.instance.js';

const DownloadButton = ({ prescriptionId }) => {
  const { isFeatureEnabled } = usePlan();
  const [isLoading, setIsLoading] = useState(false);
  const openModal = useUiStore((s) => s.openModal);

  const canDownload = isFeatureEnabled('exportReports');

  const handleDownload = async () => {
    if (!canDownload) {
      openModal(`upgrade-modal-${prescriptionId}`);
      return;
    }

    setIsLoading(true);
    try {
      // Trigger the download redirect
      const token = useAuthStore.getState().accessToken;
      const baseURL = API_BASE_URL;
      window.open(`${baseURL}/prescriptions/${prescriptionId}/download?token=${token}`, '_blank');
      toast.success('Opening prescription PDF...');
    } catch (error) {
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={canDownload ? 'secondary' : 'ghost'}
        className="py-1 px-3 text-xs"
        onClick={handleDownload}
        isLoading={isLoading}
      >
        {canDownload ? (
          <>
            <Download className="h-3.5 w-3.5" />
            PDF
          </>
        ) : (
          <span className="flex items-center gap-1 text-slate-400 font-semibold">
            <Lock className="h-3.5 w-3.5 text-medical-amber" />
            PDF
          </span>
        )}
      </Button>

      {/* Upgrade Modal Gate */}
      <Modal id={`upgrade-modal-${prescriptionId}`} title="Premium Feature Locked">
        <UpgradePrompt feature="exportReports" />
      </Modal>
    </>
  );
};

export default DownloadButton;
