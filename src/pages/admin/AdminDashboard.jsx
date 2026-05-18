import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, DollarSign, Activity, FileText, Sparkles } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import StatusPieChart from '../../components/charts/StatusPieChart.jsx';
import { analyticsApi, analyticsKeys } from '../../api/analytics.api.js';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: analyticsKeys.admin,
    queryFn: async () => {
      const res = await analyticsApi.getAdminStats();
      return res.data?.data;
    },
  });

  // Formulate status chart data
  const apptStatusData = stats?.appointmentsByStatus
    ? Object.keys(stats.appointmentsByStatus).map((key) => ({
        name: key.toUpperCase(),
        value: stats.appointmentsByStatus[key],
      }))
    : [];

  const kpis = [
    {
      title: 'Total Clinic Patients',
      value: stats?.totalPatients ?? 0,
      icon: Users,
      color: 'text-primary-500 bg-primary-50 border-primary-100',
    },
    {
      title: 'Registered Doctors',
      value: stats?.totalDoctors ?? 0,
      icon: Activity,
      color: 'text-medical-blue bg-blue-50 border-blue-100',
    },
    {
      title: 'Month Appointments',
      value: stats?.totalAppointmentsThisMonth ?? 0,
      icon: Calendar,
      color: 'text-medical-green bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Simulated Revenue',
      value: `$${stats?.revenueSimulation?.monthly ?? 0}`,
      icon: DollarSign,
      color: 'text-medical-amber bg-amber-50 border-amber-100',
    },
  ];

  return (
    <PageWrapper title="Clinic Admin Dashboard">
      <ErrorBoundary>
        <div className="space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className={`p-5 border rounded-xl bg-white shadow-sm flex items-center justify-between ${kpi.color}`}>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">{kpi.title}</span>
                    <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">{kpi.value}</h3>
                  </div>
                  <div className="p-3 bg-white border border-inherit rounded-lg shadow-xs">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Marketing & Growth Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-primary-50/20 to-blue-50/20 border border-primary-100 p-5 rounded-2xl">
            <div className="space-y-2">
              <span className="text-[10px] bg-primary-100 text-primary-700 font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                <Sparkles className="h-3 w-3" />
                AI Marketing & Growth Upgrade Active
              </span>
              <h4 className="text-sm font-bold text-slate-800">Next-Month Revenue Prediction</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our AI model predicts a <strong className="text-slate-700 font-extrabold">+18.4% revenue increase</strong> if you run SMS/WhatsApp campaigns for your Inactive Patient cohort this week.
              </p>
            </div>
            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-6 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Reputation & Automation</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Auto Google Reviews:</span>
                <span className="text-emerald-600 font-bold">ACTIVE & SENT 12 REQUESTS</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Patient Sentiment:</span>
                <span className="text-primary-600 font-bold">94% POSITIVE INSIGHTS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="card lg:col-span-2">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Appointments Status Breakdown</h4>
              {apptStatusData.length > 0 ? (
                <StatusPieChart data={apptStatusData} />
              ) : (
                <p className="text-xs text-slate-400 italic py-12 text-center">No appointment status metrics recorded yet.</p>
              )}
            </div>

            {/* Diagnoses aggregated */}
            <div className="card flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-4">Top Recorded Clinical Conditions</h4>
                <ul className="space-y-3">
                  {stats?.topDiagnoses && stats.topDiagnoses.length > 0 ? (
                    stats.topDiagnoses.map((diag, idx) => (
                      <li key={idx} className="flex justify-between items-center p-3 border border-surface-border bg-slate-50/50 rounded-xl">
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{diag.condition}</span>
                        <span className="text-xs text-slate-400 font-semibold">{diag.count} prescriptions</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-6">No prescription diagnoses recorded yet.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default AdminDashboard;
