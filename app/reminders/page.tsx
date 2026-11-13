'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Reminder {
  id: number;
  title: string;
  leadName: string | null;
  remindAt: string;
  completed: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState('');
  const [leadName, setLeadName] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reminders');
      const data = await res.json();
      if (res.ok) {
        setReminders(data.reminders || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchReminders();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchReminders]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, leadName, remindAt }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to schedule reminder.');
      } else {
        setSuccessMsg('Reminder saved successfully!');
        setTitle('');
        setLeadName('');
        setRemindAt('');
        void fetchReminders();
      }
    } catch {
      setErrorMsg('Network error while saving reminder.');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleComplete(reminder: Reminder) {
    const res = await fetch('/api/reminders/' + reminder.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !reminder.completed }),
    });
    if (res.ok) {
      void fetchReminders();
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch('/api/reminders/' + id, { method: 'DELETE' });
    if (res.ok) {
      void fetchReminders();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Follow-up Reminders</h1>
            <p className="text-sm text-gray-600">
              Schedule future follow-up calls and consultations for DocNow leads
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Set New Reminder</h2>

            {errorMsg && (
              <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm border border-green-200">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Call clinic director for demo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead / Doctor Name
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Dr. Sarah Khan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Future Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={remindAt}
                  onChange={(e) => setRemindAt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {submitting ? 'Saving...' : 'Save Reminder'}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Scheduled Reminders ({reminders.length})
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500 py-8 text-center">Loading reminders...</p>
            ) : reminders.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">
                No reminders scheduled yet. Set a future date and time on the left.
              </p>
            ) : (
              <div className="space-y-3">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-4 border border-gray-200 rounded-lg flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rem.completed}
                          onChange={() => void toggleComplete(rem)}
                          className="h-4 w-4 rounded text-indigo-600"
                        />
                        <span
                          className={`font-semibold text-sm ${
                            rem.completed ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}
                        >
                          {rem.title}
                        </span>
                      </div>
                      {rem.leadName && (
                        <div className="text-xs text-gray-600 pl-6">Contact: {rem.leadName}</div>
                      )}
                      <div className="text-xs text-indigo-700 font-medium pl-6">
                        Scheduled for: {new Date(rem.remindAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => void handleDelete(rem.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
