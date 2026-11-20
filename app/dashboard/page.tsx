// export const dynamic = 'force-dynamic';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';
// import { verifySession } from '@/lib/jwt';
// import LogoutButton from './LogoutButton';

// export default async function DashboardPage() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('staff_session')?.value;
//   const session = await verifySession(token);

//   if (!session) {
//     redirect('/login');
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
//         <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">DocNow Staff Dashboard</h1>
//             <p className="text-sm text-green-600 font-medium mt-1">
//               Authenticated via HTTP-only Session Cookie
//             </p>
//           </div>
//           <LogoutButton />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//           <Link
//             href="/leads"
//             className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
//           >
//             <div className="font-bold text-blue-900 text-sm">Leads & Contacts</div>
//             <div className="text-xs text-blue-700 mt-1">Paginated directory & CRUD</div>
//           </Link>
//           <Link
//             href="/pipeline"
//             className="p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition"
//           >
//             <div className="font-bold text-purple-900 text-sm">Pipeline Board</div>
//             <div className="text-xs text-purple-700 mt-1">Drag-and-drop Kanban stages</div>
//           </Link>
//           <Link
//             href="/reminders"
//             className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition"
//           >
//             <div className="font-bold text-indigo-900 text-sm">Reminders</div>
//             <div className="text-xs text-indigo-700 mt-1">Schedule future follow-ups</div>
//           </Link>
//           <Link
//             href="/templates"
//             className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition"
//           >
//             <div className="font-bold text-emerald-900 text-sm">Email Templates</div>
//             <div className="text-xs text-emerald-700 mt-1">Personalized clinic outreach</div>
//           </Link>
//         </div>

//         <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-2">
//           <p className="text-gray-700">
//             <span className="font-semibold">Staff ID:</span> #{session.userId}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-semibold">Name:</span> {session.name || 'Staff Member'}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-semibold">Email:</span> {session.email}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Kanban,
  BellRing,
  Mail,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { verifySession } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import AppShell from '@/components/AppShell';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('staff_session')?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login');
  }

  const [totalLeads, qualifiedOrClosedCount, upcomingRemindersCount] = await Promise.all([
    prisma.lead.count({ where: { userId: session.userId } }),
    prisma.lead.count({
      where: {
        userId: session.userId,
        status: { in: ['Qualified', 'Closed'] },
      },
    }),
    prisma.reminder.count({
      where: {
        userId: session.userId,
        completed: false,
      },
    }),
  ]);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Overview of your DocNow telehealth provider pipeline and daily tasks"
      userName={session.name || 'Staff Member'}
      userEmail={session.email}
      actions={
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          Manage Leads
          <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Authenticated Staff Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Authenticated Staff Account
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {session.name || 'Staff Member'}{' '}
                <span className="text-sm font-normal text-slate-500">
                  (Staff ID #{session.userId})
                </span>
              </h2>
              <p className="text-xs text-slate-500">{session.email}</p>
            </div>
          </div>

          <Link
            href="/pipeline"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition"
          >
            Open Pipeline
          </Link>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Leads
              </span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-3">{totalLeads}</div>
            <p className="text-xs text-slate-500 mt-1">Active clinic & provider contacts</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Qualified / Closed
              </span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Kanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-3">{qualifiedOrClosedCount}</div>
            <p className="text-xs text-slate-500 mt-1">High-intent & onboarded clinics</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Upcoming Reminders
              </span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <BellRing className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-3">{upcomingRemindersCount}</div>
            <p className="text-xs text-slate-500 mt-1">Pending follow-up calls & demos</p>
          </div>
        </div>

        {/* CRM Modules Quick Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">CRM Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/leads"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                <Users className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-sm">Leads & Contacts</div>
              <p className="text-xs text-slate-500 mt-1">
                Searchable paginated directory & CRUD
              </p>
            </Link>

            <Link
              href="/pipeline"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
                <Kanban className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-sm">Pipeline Board</div>
              <p className="text-xs text-slate-500 mt-1">
                Drag-and-drop Kanban stage tracking
              </p>
            </Link>

            <Link
              href="/reminders"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-sm">Follow-up Reminders</div>
              <p className="text-xs text-slate-500 mt-1">
                Schedule future consultation calls
              </p>
            </Link>

            <Link
              href="/templates"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Mail className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-sm">Email Templates</div>
              <p className="text-xs text-slate-500 mt-1">
                One-click personalized clinic outreach
              </p>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
