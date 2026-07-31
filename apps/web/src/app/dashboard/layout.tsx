'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardLayout, TabType } from '@/components/Dashboard/DashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState<TabType>('overview');

  useEffect(() => {
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      setCurrentTab('overview');
    } else if (pathname.includes('/dashboard/customers')) {
      setCurrentTab('customers');
    } else if (pathname.includes('/dashboard/services')) {
      setCurrentTab('services');
    } else if (pathname.includes('/dashboard/appointments')) {
      setCurrentTab('appointments');
    } else if (pathname.includes('/dashboard/financial')) {
      setCurrentTab('financial');
    }
  }, [pathname]);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'overview') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard/${tab}`);
    }
  };

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={handleTabChange}>
      {children}
    </DashboardLayout>
  );
}
