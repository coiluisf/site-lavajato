'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'tel' | 'date' | 'time' | 'textarea';
  required?: boolean;
  placeholder?: string;
}

interface CrudModalProps {
  isOpen: boolean;
  title: string;
  fields: FieldConfig[];
  schema: z.ZodSchema;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export const CrudModal: React.FC<CrudModalProps> = ({
  isOpen,
  title,
  fields,
  schema,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
    setErrors({});
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = schema.parse(formData);
      await onSubmit(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700' }}>{title}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fields.map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                {field.label}
                {field.required && <span style={{ color: 'var(--color-error-600)' }}> *</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  disabled={isSubmitting || isLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors[field.name] ? '1px solid var(--color-error-600)' : '1px solid var(--color-neutral-200)',
                    borderRadius: '0.375rem',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  disabled={isSubmitting || isLoading}
                  required={field.required}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors[field.name] ? '1px solid var(--color-error-600)' : '1px solid var(--color-neutral-200)',
                    borderRadius: '0.375rem',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              )}

              {errors[field.name] && (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-error-600)' }}>
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: isSubmitting || isLoading ? 'var(--color-neutral-300)' : 'var(--color-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
              }}
            >
              {isSubmitting || isLoading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'var(--color-neutral-100)',
                border: '1px solid var(--color-neutral-200)',
                borderRadius: '0.375rem',
                cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
