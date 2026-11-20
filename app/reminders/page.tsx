"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import AppShell from "@/components/AppShell";

interface Reminder {
  id: number;
  title: string;
  leadName: string | null;
  remindAt: string;
  completed: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [leadName, setLeadName] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reminders");
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
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, leadName, remindAt }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to schedule reminder.");
      } else {
        setSuccessMsg("Reminder scheduled successfully!");
        setTitle("");
        setLeadName("");
        setRemindAt("");
        void fetchReminders();
      }
    } catch {
      setErrorMsg("Network error while saving reminder.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleComplete(reminder: Reminder) {
    const res = await fetch("/api/reminders/" + reminder.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !reminder.completed }),
    });
    if (res.ok) {
      void fetchReminders();
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch("/api/reminders/" + id, { method: "DELETE" });
    if (res.ok) {
      void fetchReminders();
    }
  }

  return (
    <AppShell
      title="Follow-up Reminders"
      subtitle="Schedule future consultation calls and demos for DocNow telehealth leads"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Set New Reminder
            </h2>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reminder Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Call clinic director for demo"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead / Doctor Name
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Dr. Sarah Khan"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Future Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              {submitting ? "Saving..." : "Save Reminder"}
            </button>
          </form>
        </div>

        {/* Scheduled List Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Scheduled Reminders ({reminders.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500 py-12 text-center">
              Loading reminders...
            </p>
          ) : reminders.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">
              No reminders scheduled yet. Set a future date and time on the
              left.
            </p>
          ) : (
            <div className="space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-4 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => void toggleComplete(rem)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          rem.completed
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white hover:border-blue-500"
                        }`}
                      >
                        {rem.completed && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span
                        className={`font-semibold text-sm ${
                          rem.completed
                            ? "line-through text-slate-400"
                            : "text-slate-900"
                        }`}
                      >
                        {rem.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pl-7 text-xs">
                      {rem.leadName && (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {rem.leadName}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-indigo-700 font-medium">
                        <CalendarClock className="w-3.5 h-3.5 text-indigo-500" />
                        {new Date(rem.remindAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => void handleDelete(rem.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
