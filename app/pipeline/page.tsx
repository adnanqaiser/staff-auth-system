"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
}

const STAGES = ["New", "Contacted", "Qualified", "Closed"] as const;

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchAllLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?all=true");
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchAllLeads();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAllLeads]);

  async function moveLeadToStage(leadId: number, newStage: string) {
    setErrorMsg("");
    setStatusMsg("");

    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStage } : l)),
    );

    try {
      const res = await fetch("/api/leads/" + leadId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStage }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLeads(previousLeads);
        setErrorMsg(data.error || "Failed to update stage.");
      } else {
        setStatusMsg(`Lead moved to "${newStage}" stage.`);
      }
    } catch {
      setLeads(previousLeads);
      setErrorMsg("Network error while updating stage.");
    }
  }

  function handleDrop(e: React.DragEvent, targetStage: string) {
    e.preventDefault();
    const idFromTransfer = Number(e.dataTransfer.getData("text/plain"));
    const activeId = draggedId || idFromTransfer;
    if (!activeId) return;

    const currentLead = leads.find((l) => l.id === activeId);
    if (currentLead && currentLead.status !== targetStage) {
      void moveLeadToStage(activeId, targetStage);
    }
    setDraggedId(null);
  }

  function getLeadsForStage(stage: string) {
    return leads.filter((l) => {
      if (stage === "New") {
        return !["Contacted", "Qualified", "Closed"].includes(l.status);
      }
      return l.status.toLowerCase() === stage.toLowerCase();
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              DocNow Sales Pipeline (Kanban)
            </h1>
            <p className="text-sm text-gray-600">
              Drag and drop lead cards across stages to update their pipeline
              status
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/leads"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Manage Leads
            </Link>
            <Link
              href="/reminders"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Reminders
            </Link>
            <Link
              href="/templates"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Email Templates
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
            {statusMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-12">
            Loading pipeline board...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STAGES.map((stage) => {
              const stageLeads = getLeadsForStage(stage);
              return (
                <div
                  key={stage}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, stage)}
                  className="bg-gray-200/70 rounded-xl p-4 min-h-[450px] flex flex-col border-2 border-dashed border-gray-300 hover:border-blue-400 transition"
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
                    <h2 className="font-bold text-gray-800 text-base">
                      {stage}
                    </h2>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white text-gray-700 shadow-sm">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {stageLeads.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-8">
                        Drop a lead card here
                      </p>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedId(lead.id);
                            e.dataTransfer.setData(
                              "text/plain",
                              String(lead.id),
                            );
                          }}
                          onDragEnd={() => setDraggedId(null)}
                          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition space-y-2"
                        >
                          <div className="font-semibold text-gray-900 text-sm">
                            {lead.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {lead.email}
                          </div>
                          {lead.company && (
                            <div className="text-xs text-blue-700 font-medium">
                              {lead.company}
                            </div>
                          )}
                          <div className="pt-2 border-t flex items-center justify-between">
                            <span className="text-[11px] text-gray-400">
                              Move to:
                            </span>
                            <select
                              value={stage}
                              onChange={(e) =>
                                void moveLeadToStage(lead.id, e.target.value)
                              }
                              className="text-xs border border-gray-300 rounded px-1.5 py-0.5 text-gray-700 bg-gray-50"
                            >
                              {STAGES.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
