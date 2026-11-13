import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/jwt";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("staff_session")?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Staff Dashboard
            </h1>
            <p className="text-sm text-green-600 font-medium mt-1">
              Authenticated via HTTP-only Session Cookie
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Staff ID:</span> #{session.userId}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span>{" "}
            {session.name || "Staff Member"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {session.email}
          </p>
        </div>
      </div>
    </div>
  );
}
