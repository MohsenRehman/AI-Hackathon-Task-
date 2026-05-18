import { useAuth } from './useAuth.js';

export const usePlan = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const plan = user?.subscriptionPlan;
  const planName = isAdmin ? 'enterprise' : (plan?.plan || 'free');
  const features = plan?.features || {};

  const isFeatureEnabled = (key) => isAdmin || !!features[key];
  const isPro = isAdmin || planName === 'pro' || planName === 'enterprise';
  const isEnterprise = isAdmin || planName === 'enterprise';
  const isFree = !isAdmin && planName === 'free';

  return { planName, features, isFeatureEnabled, isPro, isEnterprise, isFree };
};
