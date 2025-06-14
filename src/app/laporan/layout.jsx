import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOption';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Include/Sidebar';
import Navbar from '@/components/Include/Navbar';
import Footer from '@/components/Include/Footer';

export default async function LaporanLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen overflow-hidden text-gray-900">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Konten utama: Navbar & Footer + Main content */}
      <div className="flex flex-col flex-1 w-full">
        {/* Navbar atas */}
        <Navbar />

        {/* Main content scrollable */}
        <main className="flex-grow overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Footer bawah */}
        <Footer/>
      </div>
    </div>
  );
}
