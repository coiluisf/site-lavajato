'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type PasswordResetStep = 'request' | 'confirm';

export function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<PasswordResetStep>(token ? 'confirm' : 'request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao solicitar reset de senha');
      }

      setMessage('E-mail de recuperação enviado. Verifique sua caixa de entrada.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!response.ok) {
        throw new Error('Token inválido ou expirado');
      }

      setMessage('Senha atualizada com sucesso! Redirecionando...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
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
      {/* Sidebar */}
      <div style={{
        background: 'var(--color-neutral-900)',
        color: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 15% 85%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 55%)',
        }} />

        <div style={{ position: 'relative' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '38px',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            margin: '0 0 16px',
          }}>
            Recuperar acesso
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'color-mix(in srgb, var(--color-bg) 70%, transparent)',
            lineHeight: 1.6,
            maxWidth: '440px',
          }}>
            {step === 'request'
              ? 'Informamos seu e-mail registrado e enviaremos um link para resetar sua senha.'
              : 'Defina uma nova senha segura para sua conta.'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text)',
              textDecoration: 'none',
              marginBottom: '32px',
            }}
          >
            ← Voltar ao login
          </Link>

          <form onSubmit={step === 'request' ? handleRequestReset : handleConfirmReset}>
            {step === 'request' ? (
              <>
                <h2 style={{ margin: '0 0 6px' }}>Recuperar senha</h2>
                <div className="text-muted" style={{ fontSize: '14px', marginBottom: '32px' }}>
                  Informe o e-mail da sua conta.
                </div>

                <div className="field" style={{ marginBottom: '16px' }}>
                  <label>E-mail</label>
                  <div style={{ position: 'relative' }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-neutral-500)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                    <input
                      className="input"
                      type="email"
                      placeholder="seuemail@nitrowash.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      style={{ borderRadius: '10px', paddingLeft: '36px' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ margin: '0 0 6px' }}>Nova senha</h2>
                <div className="text-muted" style={{ fontSize: '14px', marginBottom: '32px' }}>
                  Defina uma nova senha para sua conta.
                </div>

                <div className="field" style={{ marginBottom: '16px' }}>
                  <label>Senha</label>
                  <div style={{ position: 'relative' }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-neutral-500)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                    <input
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      style={{ borderRadius: '10px', paddingLeft: '36px', paddingRight: '36px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      style={{
                        position: 'absolute',
                        right: '11px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        color: 'var(--color-neutral-500)',
                        display: 'flex',
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.9 17.9A10.6 10.6 0 0 1 12 20c-7 0-11-8-11-8a19.6 19.6 0 0 1 5-6.1M9.9 5.2A9.8 9.8 0 0 1 12 5c7 0 11 8 11 8a19.4 19.4 0 0 1-3.2 4.4" />
                          <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
                          <line x1="2" y1="2" x2="22" y2="22" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="field" style={{ marginBottom: '16px' }}>
                  <label>Confirmar senha</label>
                  <div style={{ position: 'relative' }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-neutral-500)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                    <input
                      className="input"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      style={{ borderRadius: '10px', paddingLeft: '36px' }}
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div style={{ fontSize: '12px', color: 'var(--color-accent-700)', marginBottom: '16px', padding: '8px', background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            {message && (
              <div style={{ fontSize: '12px', color: 'var(--color-accent-500)', marginBottom: '16px', padding: '8px', background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', borderRadius: '6px' }}>
                {message}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{
                borderRadius: '10px',
                padding: '11px',
                fontSize: '14.5px',
                width: '100%',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading
                ? step === 'request'
                  ? 'Enviando...'
                  : 'Atualizando...'
                : step === 'request'
                  ? 'Enviar link'
                  : 'Atualizar senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
