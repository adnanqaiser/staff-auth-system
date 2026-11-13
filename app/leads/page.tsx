'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('NEW');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '5',
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

    useEffect(() => {
    const timer = setTimeout(() => {
      void fetchLeads();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchLeads]);


  function resetForm() {
    setEditingId(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setStatus('NEW');
    setNotes('');
    setFormError('');
  }

  function startEdit(lead: Lead) {
    setEditingId(lead.id);
    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone || '');
    setCompany(lead.company || '');
    setStatus(lead.status);
    setNotes(lead.notes || '');
    setFormError('');
    setFormSuccess('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const url = editingId ? `/api/leads/${editingId}` : '/api/leads';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, status, notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to save lead.');
      } else {
        setFormSuccess(editingId ? 'Lead updated successfully!' : 'Lead added successfully!');
        resetForm();
        fetchLeads();
      }
    } catch {
      setFormError('Network error while saving lead.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFormSuccess('Lead deleted successfully.');
      if (leads.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchLeads();
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DocNow Leads & Contacts</h1>
            <p className="text-sm text-gray-600">
              Manage telehealth clinic leads and patient inquiries ({totalCount} total)
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? `Edit Lead #${editingId}` : 'Add New Lead'}
            </h2>

            {formError && (
              <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm border border-green-200">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Sarah Khan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@clinic.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic / Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="City Care Telehealth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Interested in online consultation package"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Lead' : 'Create Lead'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-gray-900">Leads Directory</h2>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, email, clinic..."
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 w-64"
                />
              </div>

              {loading ? (
                <p className="text-sm text-gray-500 py-8 text-center">Loading leads...</p>
              ) : leads.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  No leads found. Add your first lead using the form.
                </p>
              ) : (
                                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{lead.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {lead.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {lead.email} {lead.phone ? `• ${lead.phone}` : ''}
                        </div>
                        {lead.company && (
                          <div className="text-xs text-gray-500">Clinic/Company: {lead.company}</div>
                        )}
                        {lead.notes && (
                          <div className="text-xs text-gray-500 italic">{lead.notes}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <button
                          onClick={() => startEdit(lead)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-4 mt-4 text-sm text-gray-600">
              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <div className="space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

