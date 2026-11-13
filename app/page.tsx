import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Staff Authentication System
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Secure login & registration with Next.js, Prisma, PostgreSQL, and
          bcrypt
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Staff Login
          </Link>
          <Link
            href="/register"
            className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Staff Registration
          </Link>
          <Link
            href="/dashboard"
            className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Go to Protected Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
