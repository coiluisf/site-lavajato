'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/Common/Toast';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      const { accessToken, refreshToken, user } = data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('companyId', user.companyId);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);

      document.cookie = `token=${accessToken}; path=/; max-age=900; SameSite=Strict`;

      setToastMessage({ message: 'Login realizado com sucesso', type: 'success' });

      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err) {
      setToastMessage({
        message: err instanceof Error ? err.message : 'Erro ao fazer login',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-neutral-50)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid var(--color-neutral-200)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center' }}>
          🧼 LavaJato
        </h1>
        <p style={{ margin: '0 0 2rem 0', textAlign: 'center', color: 'var(--color-neutral-600)' }}>
          Sistema de Gerenciamento
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--color-neutral-200)',
                borderRadius: '0.375rem',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--color-neutral-200)',
                borderRadius: '0.375rem',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              backgroundColor: isLoading ? 'var(--color-neutral-300)' : 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
            }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ margin: '1.5rem 0 0 0', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
          Não tem conta?{' '}
          <a
            href="/signup"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Cadastre-se
          </a>
        </p>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default LoginPage;
