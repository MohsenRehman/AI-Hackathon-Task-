import React from 'react';
import Badge from '../ui/Badge.jsx';
import { APPOINTMENT_STATUS, SUBSCRIPTION_PLANS } from '../../utils/constants.js';

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case APPOINTMENT_STATUS.PENDING:
      return <Badge variant="warning">{status}</Badge>;
    case APPOINTMENT_STATUS.CONFIRMED:
      return <Badge variant="info">{status}</Badge>;
    case APPOINTMENT_STATUS.COMPLETED:
      return <Badge variant="success">{status}</Badge>;
    case APPOINTMENT_STATUS.CANCELLED:
      return <Badge variant="danger">{status}</Badge>;
    
    // Subscriptions
    case SUBSCRIPTION_PLANS.FREE:
      return <Badge variant="info">Free</Badge>;
    case SUBSCRIPTION_PLANS.PRO:
      return <Badge variant="success">Pro</Badge>;
    case SUBSCRIPTION_PLANS.ENTERPRISE:
      return <Badge variant="warning">Enterprise</Badge>;

    default:
      return <Badge variant="info">{status}</Badge>;
  }
};

export default StatusBadge;
