'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LoginFormProps {
  onSubmit: (email: string, password: string, remember: boolean) => Promise<void>;
}

const EYE_OPEN = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EYE_CLOSED = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.9 17.9A10.6 10.6 0 0 1 12 20c-7 0-11-8-11-8a19.6 19.6 0 0 1 5-6.1M9.9 5.2A9.8 9.8 0 0 1 12 5c7 0 11 8 11 8a19.4 19.4 0 0 1-3.2 4.4" />
    <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setShowError(true);
      setErrorMessage('Informe um e-mail válido para continuar.');
      return;
    }

    if (!password) {
      setShowError(true);
      setErrorMessage('Informe sua senha para continuar.');
      return;
    }

    setShowError(false);
    setSubmitting(true);

    try {
      await onSubmit(email, password, remember);
    } catch (error) {
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <h2 style={{ margin: '0 0 6px' }}>Entrar</h2>
        <div className="text-muted" style={{ fontSize: '14px', marginBottom: '32px' }}>
          Acesse o painel de gestão da sua unidade.
        </div>

        <form onSubmit={handleSubmit}>
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
                disabled={submitting}
                style={{ borderRadius: '10px', paddingLeft: '36px' }}
              />
            </div>
            {showError && email && !email.includes('@') && (
              <div style={{ fontSize: '12px', color: 'var(--color-accent-700)', marginTop: '5px' }}>
                Informe um e-mail válido para continuar.
              </div>
            )}
          </div>

          <div className="field" style={{ marginBottom: '10px' }}>
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
                disabled={submitting}
                style={{ borderRadius: '10px', paddingLeft: '36px', paddingRight: '36px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={submitting}
                style={{
                  position: 'absolute',
                  right: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  color: 'var(--color-neutral-500)',
                  display: 'flex',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  opacity: submitting ? 0.5 : 1,
                }}
              >
                {showPassword ? EYE_CLOSED : EYE_OPEN}
              </button>
            </div>
          </div>

          {showError && errorMessage && (
            <div style={{ fontSize: '12px', color: 'var(--color-accent-700)', marginBottom: '16px' }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  accentColor: 'var(--color-accent)',
                }}
              />
              Manter conectado
            </label>
            <Link href="/password-reset" style={{ fontSize: '13px', fontWeight: 600, textDecoration: 'none', color: 'var(--color-text)' }}>
              Esqueceu a senha?
            </Link>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
            style={{
              borderRadius: '10px',
              padding: '11px',
              fontSize: '14.5px',
              width: '100%',
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-neutral-200)' }} />
            <span className="text-muted" style={{ fontSize: '11.5px' }}>
              acesso restrito
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-neutral-200)' }} />
          </div>

          <div className="text-muted" style={{ fontSize: '12.5px', textAlign: 'center', lineHeight: 1.6 }}>
            Este painel é de uso exclusivo da equipe autorizada.
            <br />
            Problemas para entrar? Fale com o administrador da unidade.
          </div>
        </form>
      </div>
    </div>
  );
}
