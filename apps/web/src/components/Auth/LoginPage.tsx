'use client';

import { useRouter } from 'next/navigation';
import { LoginSidebar } from './LoginSidebar';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string, remember: boolean) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Email ou senha inválidos');
      }

      const data = await response.json();
      const { accessToken, refreshToken } = data;

      localStorage.setItem('accessToken', accessToken);
      if (remember) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
    }}>
      <LoginSidebar />
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
