import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, HardDrive, RefreshCw, Terminal } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import Button from '../../components/ui/Button.jsx';

const SystemMonitorPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(18);
  const [ramUsage, setRamUsage] = useState(42);
  const [logs, setLogs] = useState([]);

  // Generate simulated activity logs
  const generateSimulatedLogs = () => {
    const endpoints = [
      { path: 'GET /api/v1/auth/me', status: 200, latency: '24ms', user: 'admin@clinic.com' },
      { path: 'GET /api/v1/analytics/admin', status: 200, latency: '48ms', user: 'admin@clinic.com' },
      { path: 'POST /api/v1/appointments', status: 201, latency: '112ms', user: 'receptionist@clinic.com' },
      { path: 'GET /api/v1/patients', status: 200, latency: '15ms', user: 'doctor@clinic.com' },
      { path: 'POST /api/v1/diagnosis/ai', status: 200, latency: '1420ms', user: 'doctor@clinic.com' },
      { path: 'GET /api/v1/subscriptions/my-plan', status: 200, latency: '8ms', user: 'patient@clinic.com' },
    ];

    const newLogs = [];
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const randomEp = endpoints[Math.floor(Math.random() * endpoints.length)];
      const logTime = new Date(now.getTime() - Math.floor(Math.random() * 60000) * i);
      newLogs.push({
        id: Math.random().toString(36).substring(7),
        time: logTime.toLocaleTimeString(),
        ...randomEp,
      });
    }
    return newLogs.sort((a, b) => b.time.localeCompare(a.time));
  };

  useEffect(() => {
    setLogs(generateSimulatedLogs());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCpuUsage(Math.floor(Math.random() * 35) + 10);
      setRamUsage(Math.floor(Math.random() * 15) + 35);
      setLogs(generateSimulatedLogs());
      setIsRefreshing(false);
    }, 800);
  };

  const metrics = [
    {
      title: 'Server Status',
      value: 'Online & Healthy',
      desc: 'Local Host Node Cluster',
      icon: Server,
      color: 'border-emerald-100 bg-emerald-50/50 text-emerald-600',
    },
    {
      title: 'CPU Core Load',
      value: `${cpuUsage}%`,
      desc: 'Average system execution thread load',
      icon: Cpu,
      color: 'border-blue-100 bg-blue-50/50 text-blue-600',
      progress: cpuUsage,
    },
    {
      title: 'RAM Utilization',
      value: `${ramUsage}%`,
      desc: 'Allocated MongoDB/Node Heap Size',
      icon: HardDrive,
      color: 'border-amber-100 bg-amber-50/50 text-amber-600',
      progress: ramUsage,
    },
    {
      title: 'Simulated API Requests',
      value: '1,284 rq/hr',
      desc: 'Daily API load simulation',
      icon: Activity,
      color: 'border-primary-100 bg-primary-50/50 text-primary-600',
    },
  ];

  return (
    <PageWrapper title="System Performance & Usage Monitor">
      <ErrorBoundary>
        <div className="space-y-8">
          {/* Header Panel */}
          <div className="flex justify-between items-center bg-white p-4 border border-surface-border rounded-xl shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">System Monitoring</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time Node.js execution logs & diagnostic health-checks</p>
            </div>
            <Button onClick={handleRefresh} isLoading={isRefreshing} className="flex items-center gap-1.5" variant="secondary">
              <RefreshCw className="h-4 w-4" />
              Force Refetch Diagnostics
            </Button>
          </div>

          {/* Cards metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className={`p-5 border rounded-xl bg-white shadow-sm flex flex-col justify-between ${m.color}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">{m.title}</span>
                      <h4 className="text-xl font-extrabold text-slate-800 mt-1 font-display">{m.value}</h4>
                    </div>
                    <div className="p-2.5 bg-white border border-inherit rounded-lg shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    {m.progress !== undefined ? (
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-current h-full transition-all duration-500" style={{ width: `${m.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{m.desc}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold">{m.desc}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Logs & Shell Output */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Log Stream */}
            <div className="card lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-700">Live API Requests Stream</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Streaming Live
                  </span>
                </div>
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center p-3 border border-surface-border bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 font-mono shrink-0">{log.time}</span>
                        <div>
                          <span className="text-xs font-bold text-slate-700 font-mono block">{log.path}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">User: {log.user}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{log.latency}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                          log.status === 201 
                            ? 'bg-emerald-50 border-emerald-400/20 text-emerald-600' 
                            : 'bg-blue-50 border-blue-400/20 text-blue-600'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal Console Log */}
            <div className="card flex flex-col bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs overflow-hidden p-0 shadow-lg min-h-[350px]">
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-primary-500" />
                  Local Node Process
                </span>
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500/80" />
                  <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                </div>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto flex-grow max-h-[300px] text-emerald-400">
                <p className="text-slate-500">[INFO] 2026-05-18T15:00:00.284Z - Node.js microservices starting...</p>
                <p className="text-slate-500">[INFO] [Mongoose] Initializing MongoDB database collection index mappings...</p>
                <p className="text-emerald-500">[SUCCESS] [MongoDB] Database successfully seed established.</p>
                <p className="text-emerald-500">[SUCCESS] Server running on http://localhost:8000 (PID: 2838)</p>
                <p className="text-slate-500">[API] GET /api/v1/auth/me - Authorized admin@clinic.com</p>
                <p className="text-slate-500">[API] GET /api/v1/analytics/admin - 200 SUCCESS (48ms)</p>
                <p className="text-slate-500">[SYSTEM] Cache hit for analytics_metrics_v1</p>
                <p className="text-slate-400 italic mt-4">[Streaming terminal logs active...]</p>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default SystemMonitorPage;
