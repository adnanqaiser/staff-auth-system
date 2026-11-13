import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifySession } from '@/lib/jwt';
import LogoutButton from './LogoutButton';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('staff_session')?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DocNow Staff Dashboard</h1>
            <p className="text-sm text-green-600 font-medium mt-1">
              Authenticated via HTTP-only Session Cookie
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/leads"
            className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
          >
            <div className="font-bold text-blue-900 text-sm">Leads & Contacts</div>
            <div className="text-xs text-blue-700 mt-1">Paginated directory & CRUD</div>
          </Link>
          <Link
            href="/pipeline"
            className="p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition"
          >
            <div className="font-bold text-purple-900 text-sm">Pipeline Board</div>
            <div className="text-xs text-purple-700 mt-1">Drag-and-drop Kanban stages</div>
          </Link>
          <Link
            href="/reminders"
            className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition"
          >
            <div className="font-bold text-indigo-900 text-sm">Reminders</div>
            <div className="text-xs text-indigo-700 mt-1">Schedule future follow-ups</div>
          </Link>
          <Link
            href="/templates"
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition"
          >
            <div className="font-bold text-emerald-900 text-sm">Email Templates</div>
            <div className="text-xs text-emerald-700 mt-1">Personalized clinic outreach</div>
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Staff ID:</span> #{session.userId}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {session.name || 'Staff Member'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {session.email}
          </p>
        </div>
      </div>
    </div>
  );
}
