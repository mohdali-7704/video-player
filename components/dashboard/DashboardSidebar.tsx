'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/dashboard/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/courses', label: 'Courses', icon: '📚' },
    { href: '/dashboard/courses/upload', label: 'Upload Course', icon: '➕' },
    { href: '/dashboard/ads', label: 'Ad Analytics', icon: '📺' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Course Management</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>

        {/* Back to Courses Link */}
        <Link
          href="/"
          className="mt-2 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors text-sm"
        >
          <span>←</span>
          <span>Back to Courses</span>
        </Link>
      </div>
    </div>
  );
}
