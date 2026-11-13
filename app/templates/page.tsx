'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Email Templates</h1>
            <p className="text-sm text-gray-600">
              Ready-to-use personalized outreach templates for DocNow Telehealth leads
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/pipeline"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Pipeline Board
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">1. Choose Template</h2>
            <div className="space-y-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedId(tpl.id)}
                  className={`w-full text-left p-3 rounded-lg border text-sm font-medium transition ${
                    selectedId === tpl.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t space-y-3">
              <h3 className="text-sm font-bold text-gray-900">2. Personalize Variables</h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Live Email Preview</h2>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                >
                  {copied ? 'Copied to Clipboard!' : 'Copy Email'}
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800">
                <span className="font-semibold">Subject:</span> {personalizedSubject}
              </div>

              <pre className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {personalizedBody}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
