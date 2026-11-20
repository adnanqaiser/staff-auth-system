'use client';

import { useState } from 'react';
import { Check, Copy, FileText, Mail, Sparkles } from 'lucide-react';
import AppShell from '@/components/AppShell';

const TEMPLATES = [
  {
    id: 'welcome',
    title: 'Initial Telehealth Onboarding Outreach',
    subject: 'Partner with DocNow Telehealth — Expand Your Online Consultations',
    body: `Dear {{Doctor_Name}},

We noticed {{Clinic_Name}} is growing its patient care services and would love to introduce DocNow Telehealth. Our platform enables your doctors to run secure HD video consultations, digital prescriptions, and automated appointment reminders.

Would you be available for a 15-minute demo this week?

Best regards,
DocNow Telehealth Sales Team`,
  },
  {
    id: 'followup',
    title: 'Demo Follow-Up & Custom Pricing Proposal',
    subject: 'Follow-up: DocNow Telehealth Demo & Clinic Package',
    body: `Dear {{Doctor_Name}},

Thank you for speaking with us about {{Clinic_Name}}. Based on your team size, we have prepared a tailored telehealth plan with zero setup fees and 24/7 technical onboarding.

Please reply to this email or schedule a quick call so we can get your clinic live within 48 hours.

Warm regards,
DocNow Telehealth Sales Team`,
  },
  {
    id: 'closing',
    title: 'Final Onboarding & Activation Checklist',
    subject: 'Welcome to DocNow Telehealth — Next Steps for {{Clinic_Name}}',
    body: `Dear {{Doctor_Name}},

We are excited to welcome {{Clinic_Name}} to DocNow Telehealth! Please share your doctor roster and preferred consultation hours so our team can activate your clinic portal today.

Best regards,
DocNow Telehealth Onboarding Team`,
  },
];

export default function EmailTemplatesPage() {
  const [selectedId, setSelectedId] = useState('welcome');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Khan');
  const [clinicName, setClinicName] = useState('City Care Telehealth');
  const [copied, setCopied] = useState(false);

  const activeTemplate = TEMPLATES.find((t) => t.id === selectedId) || TEMPLATES.at(0)!;

  const personalizedSubject = activeTemplate.subject
    .replaceAll('{{Doctor_Name}}', doctorName || 'Doctor')
    .replaceAll('{{Clinic_Name}}', clinicName || 'Your Clinic');

  const personalizedBody = activeTemplate.body
    .replaceAll('{{Doctor_Name}}', doctorName || 'Doctor')
    .replaceAll('{{Clinic_Name}}', clinicName || 'Your Clinic');

  function handleCopy() {
    void navigator.clipboard.writeText(`Subject: ${personalizedSubject}\n\n${personalizedBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AppShell
      title="Sales Email Templates"
      subtitle="Ready-to-use personalized outreach templates for DocNow Telehealth leads"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector & Variables */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 h-fit">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">1. Choose Template</h2>
            </div>
            <div className="space-y-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedId(tpl.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition ${
                    selectedId === tpl.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">2. Personalize Variables</h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Live Email Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Live Email Preview</h2>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Email'}
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800">
              <span className="font-semibold text-slate-500">Subject:</span> {personalizedSubject}
            </div>

            <pre className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
              {personalizedBody}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
