import { cookies } from 'next/headers';
import { signToken } from './jwt';

export async function createSession(userId: number, email: string, name?: string | null) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await signToken({ userId, email, name });

  const cookieStore = await cookies();
  cookieStore.set('staff_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('staff_session');
}
