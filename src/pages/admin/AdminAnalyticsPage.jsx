import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import PlanRoute from '../../routes/PlanRoute.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import AppointmentsBarChart from '../../components/charts/AppointmentsBarChart.jsx';
import PatientsLineChart from '../../components/charts/PatientsLineChart.jsx';

const AdminAnalyticsPage = () => {
  // Advanced Mock Analytics Data for Pro/Enterprise tier view
  const advancedDensity = [
    { name: 'Week 1', appointments: 150 },
    { name: 'Week 2', appointments: 230 },
    { name: 'Week 3', appointments: 180 },
    { name: 'Week 4', appointments: 310 },
  ];

  const advancedGrowth = [
    { name: 'Week 1', patients: 500 },
    { name: 'Week 2', patients: 580 },
    { name: 'Week 3', patients: 640 },
    { name: 'Week 4', patients: 780 },
  ];

  return (
    <PageWrapper title="Advanced Clinic Analytics">
      <ErrorBoundary>
        <PlanRoute feature="advancedAnalytics">
          <div className="space-y-8">
            <div className="card bg-slate-900 border-0 text-white p-6 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-primary-500 text-white font-extrabold uppercase px-2 py-0.5 rounded">
                  PRO VIEW
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-2">Real-Time Aggregations</h3>
                <p className="text-xs text-slate-400 mt-1">High-density visual reporting of patient intake and appointment volumes.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Patient Intake Densities (Monthly)</h4>
                <PatientsLineChart data={advancedGrowth} />
              </div>

              <div className="card">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Weekly Appointment Densities</h4>
                <AppointmentsBarChart data={advancedDensity} />
              </div>
            </div>
          </div>
        </PlanRoute>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default AdminAnalyticsPage;
