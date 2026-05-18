import React, { useState } from 'react';
import { Megaphone, Users, MessageSquare, Star, ArrowUpRight, TrendingUp, Sparkles, Send, Mail, PhoneCall } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

const MarketingHubPage = () => {
  const [selectedSegment, setSelectedSegment] = useState('inactive');
  const [channel, setChannel] = useState('email');
  const [campaignText, setCampaignText] = useState('Hi! We noticed it has been a while since your last health checkup. Schedule a diagnostic assessment today and receive a 15% discount!');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [autoReview, setAutoReview] = useState(true);

  // Simulated Segments Data
  const segments = [
    { id: 'new', label: 'New Patients', count: 18, desc: 'Registered in the last 30 days', icon: Users, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { id: 'inactive', label: 'Inactive Patients', count: 42, desc: 'No appointments in 3+ months', icon: Users, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { id: 'chronic', label: 'Chronic Care', count: 31, desc: 'Regular treatment requirements', icon: Users, color: 'text-red-500 bg-red-50 border-red-100' },
    { id: 'vip', label: 'VIP Members', count: 12, desc: 'High retention patients', icon: Users, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
  ];

  // Simulated AI feedback optimization
  const handleAIOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setCampaignText(
        '🌟 Hello from CliniqAI! Your health is our priority. It has been a while since your last comprehensive checkup. Let\'s keep you in perfect shape! Book your priority assessment today & receive a premium wellness evaluation. Slots are limited!'
      );
      setIsOptimizing(false);
      toast.success('Campaign message enhanced with AI copywriting!');
    }, 700);
  };

  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    if (!campaignText) {
      toast.error('Campaign content cannot be empty.');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Targeted campaign successfully launched via ${channel.toUpperCase()} to ${segments.find(s => s.id === selectedSegment)?.count} patients!`);
    }, 1500);
  };

  const aiSuggestions = [
    {
      title: 'Optimize Recall Strategy',
      text: 'Schedule diabetes routine reminders 7 days early. Predicted conversion rate +18%.',
      impact: 'High Impact',
    },
    {
      title: 'Google Review Boost',
      text: 'Google review invitations sent at 4 PM post-appointment generate 24% higher click rates.',
      impact: 'Medium Impact',
    },
    {
      title: 'VIP Engagement',
      text: 'Send automated dietary wellness guides to chronic care patients to increase clinical trust.',
      impact: 'High Impact',
    },
  ];

  return (
    <PageWrapper title="AI + Digital Marketing Hub">
      <ErrorBoundary>
        <div className="space-y-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Targeted Campaigns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Segmentation Panel */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-700">Patient Promotion Segments</h4>
                  <span className="text-[10px] bg-primary-50 text-primary-600 font-extrabold uppercase px-2 py-0.5 rounded-full">
                    AI Auto-Segmented
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {segments.map((seg) => {
                    const Icon = seg.icon;
                    const isSelected = selectedSegment === seg.id;
                    return (
                      <button
                        key={seg.id}
                        onClick={() => setSelectedSegment(seg.id)}
                        className={`p-4 border rounded-xl flex items-center justify-between text-left cursor-pointer transition-all duration-150 ${
                          isSelected 
                            ? 'border-primary-500 ring-2 ring-primary-500/20 bg-white' 
                            : 'border-surface-border bg-slate-50/50 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-700 block">{seg.label}</span>
                          <span className="text-[10px] text-slate-400 block font-medium">{seg.desc}</span>
                        </div>
                        <div className={`p-2.5 rounded-lg flex items-center gap-1 font-bold ${seg.color}`}>
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{seg.count}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campaign Composer */}
              <div className="card">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Targeted Campaign Launcher</h4>
                <form onSubmit={handleLaunchCampaign} className="space-y-4">
                  {/* Select Channel */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block">Communication Channel</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'email', label: 'Email Outbox', icon: Mail },
                        { id: 'sms', label: 'SMS Blast', icon: MessageSquare },
                        { id: 'whatsapp', label: 'WhatsApp API', icon: Megaphone },
                      ].map((ch) => {
                        const Icon = ch.icon;
                        const isChSelected = channel === ch.id;
                        return (
                          <button
                            type="button"
                            key={ch.id}
                            onClick={() => setChannel(ch.id)}
                            className={`p-3 border rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer transition-all duration-150 ${
                              isChSelected
                                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {ch.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500">Campaign Content</label>
                      <button
                        type="button"
                        onClick={handleAIOptimize}
                        disabled={isOptimizing}
                        className="text-[10px] font-bold text-primary-600 flex items-center gap-1 bg-primary-50 px-2 py-1 rounded hover:bg-primary-100/70 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {isOptimizing ? 'AI Enhancing...' : 'AI Enhance Copywriting'}
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={campaignText}
                      onChange={(e) => setCampaignText(e.target.value)}
                      className="w-full bg-slate-50/50 border border-surface-border rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium font-sans"
                      placeholder="Compose your promotional message..."
                    />
                  </div>

                  {/* Send Campaign Button */}
                  <Button type="submit" isLoading={isSending} className="w-full flex items-center justify-center gap-1.5">
                    <Send className="h-4 w-4" />
                    Launch Campaign to {segments.find(s => s.id === selectedSegment)?.label} ({segments.find(s => s.id === selectedSegment)?.count} Patients)
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Column: AI Analytics & Feedback Monitor */}
            <div className="space-y-6">
              {/* Revenue & Subscription Growth Card */}
              <div className="p-5 border border-primary-100 bg-gradient-to-br from-primary-50/30 to-blue-50/30 rounded-xl shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-primary-100 text-primary-700 font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                      <TrendingUp className="h-3 w-3" />
                      AI Revenue Predictor
                    </span>
                    <h4 className="text-xl font-extrabold text-slate-800 mt-2 font-display">+18.4%</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Estimated next quarter conversion growth</p>
                  </div>
                  <div className="p-2.5 bg-white border border-primary-100 rounded-lg shadow-xs text-primary-500">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 block">AI Subscription Upgrade Insight</span>
                  <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                    Based on patient segment trends, migrating receptionists to Pro/Enterprise scheduling options can boost check-ins by 22%.
                  </p>
                </div>
              </div>

              {/* Clinic Reputation & Auto Reviews */}
              <div className="card space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-700">Reputation & Reviews</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                    <Star className="h-3 w-3 fill-current" />
                    94% Positive
                  </span>
                </div>

                {/* Auto Review Toggle */}
                <div className="flex justify-between items-center p-3 border border-surface-border bg-slate-50/50 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Post-Appointment Reviews</span>
                    <span className="text-[9px] text-slate-400 block font-medium">Auto-send Google Review request after appointments</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReview}
                    onChange={(e) => setAutoReview(e.target.checked)}
                    className="h-4 w-4 text-primary-500 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                </div>

                {/* Patient Sentiment Analysis Logs */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Sentiment Analysis Feed</span>
                  <div className="p-2.5 border border-surface-border bg-slate-50/20 rounded-xl space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[9px] font-extrabold text-slate-600">Patient: Arthur P.</span>
                      <span className="text-[9px] font-bold text-emerald-600">Excellent (98%)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">"The AI symptom wizard was extremely accurate, clinic felt premium."</p>
                  </div>
                </div>
              </div>

              {/* AI suggestions */}
              <div className="card space-y-4">
                <h4 className="text-sm font-bold text-slate-700">AI Engagement Suggestions</h4>
                <div className="space-y-3.5">
                  {aiSuggestions.map((sug, idx) => (
                    <div key={idx} className="p-3 border border-surface-border rounded-xl space-y-1 bg-white hover:border-primary-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">{sug.title}</span>
                        <span className="text-[8px] bg-primary-50 text-primary-600 font-extrabold px-1.5 py-0.5 rounded">
                          {sug.impact}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{sug.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default MarketingHubPage;
