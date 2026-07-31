'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { Skeleton } from '@/components/Common/Skeleton';

const RootPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const token = getToken();

    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Skeleton height="2rem" width="200px" />
      </div>
    );
  }

  return null;
};

export default RootPage;
