import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import Button from '../../components/ui/Button.jsx';
import { subscriptionApi } from '../../api/subscription.api.js';

import useAuthStore from '../../store/authStore.js';

const UpgradePage = () => {
  const queryClient = useQueryClient();
  const hydrateFromServer = useAuthStore((s) => s.hydrateFromServer);

  // Fetch subscription details
  const { data: myPlan } = useQuery({
    queryKey: ['subscription', 'my-plan'],
    queryFn: async () => {
      const res = await subscriptionApi.getMyPlan();
      return res.data?.data;
    },
  });

  // Mutation to upgrade subscription
  const { mutate: upgradePlan, isPending } = useMutation({
    mutationFn: async (plan) => {
      const res = await subscriptionApi.upgrade(plan);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      hydrateFromServer();
      toast.success('Subscription upgraded successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Upgrade failed. Please try again.');
    },
  });

  const plans = [
    {
      name: 'free',
      price: '$0',
      desc: 'Baseline scheduling features for small startup clinics',
      icon: ShieldCheck,
      color: 'border-slate-200 text-slate-700 bg-white',
      features: ['Basic Scheduling Calendar', '1 Clinic Doctor', 'Manual Prescriptions (Standard PDF)'],
    },
    {
      name: 'pro',
      price: '$49/mo',
      desc: 'Empower practitioners with diagnostic AI wizards',
      icon: Zap,
      color: 'border-primary-500 ring-2 ring-primary-500/20 text-slate-800 bg-white relative',
      popular: true,
      features: [
        'AI Symptom Analysis & Risk Gauges',
        'Urdu Dialect Translation',
        'PDF prescriptions cloud export',
        'Advanced Analytics Aggregations',
      ],
    },
    {
      name: 'enterprise',
      price: '$149/mo',
      desc: 'Seamless coordinate multi-doctor medical teams',
      icon: Sparkles,
      color: 'border-slate-800 text-slate-800 bg-white',
      features: [
        'All Pro Tier Benefits',
        'Dedicated SLA Cloud Backups',
        'Custom Medical Form Builder',
        '24/7 Priority Clinical Support',
      ],
    },
  ];

  return (
    <PageWrapper title="Elevate Plan & Gating Tiers">
      <ErrorBoundary>
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Upgrade to the Pro or Enterprise plan to unlock premium AI diagnostic assistants, translation models, and advanced analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p, idx) => {
              const Icon = p.icon;
              const isCurrent = (myPlan?.plan || 'free').toLowerCase() === p.name;
              return (
                <div key={idx} className={`card flex flex-col justify-between p-6 ${p.color}`}>
                  {p.popular && (
                    <span className="absolute -top-3 right-6 bg-primary-500 text-white text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-full shadow-md">
                      POPULAR CHOICE
                    </span>
                  )}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold font-display capitalize">{p.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                      </div>
                      <Icon className="h-5 w-5 text-primary-500 shrink-0" />
                    </div>

                    <div className="py-2 border-y border-slate-100">
                      <span className="text-2xl font-bold text-slate-800 font-display">{p.price}</span>
                      <span className="text-[10px] text-slate-400 ml-1">/ month</span>
                    </div>

                    <ul className="space-y-2.5">
                      {p.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-500 flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => upgradePlan(p.name)}
                    disabled={isCurrent || isPending}
                    className="w-full mt-6"
                    variant={isCurrent ? 'secondary' : 'primary'}
                  >
                    {isCurrent ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default UpgradePage;
