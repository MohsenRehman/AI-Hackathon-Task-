import React from 'react';
import { usePlan } from '../hooks/usePlan.js';
import UpgradePrompt from '../components/shared/UpgradePrompt.jsx';

const PlanRoute = ({ feature, children }) => {
  const { isFeatureEnabled } = usePlan();

  if (!isFeatureEnabled(feature)) {
    return <UpgradePrompt feature={feature} />;
  }

  return children;
};

export default PlanRoute;
