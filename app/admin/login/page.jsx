import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminLogin from '@/components/AdminLogin';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect('/admin');
  return <AdminLogin />;
}
