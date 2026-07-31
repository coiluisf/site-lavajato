'use client';

import React from 'react';

export interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps<T = any> {
  columns: Column[];
  data: T[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  width: '120px',
                }}
              >
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ textAlign: 'center', padding: '2rem' }}>
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-neutral-500)' }}>
                Nenhum registro encontrado
              </td>
            </tr>
          ) : (
            data.map((item: any, idx) => (
              <tr key={item.id || idx} style={{ borderBottom: '1px solid var(--color-neutral-100)' }}>
                {columns.map((col) => (
                  <td key={`${item.id}-${col.key}`} style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: 'var(--color-neutral-100)',
                            border: '1px solid var(--color-neutral-200)',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fca5a5',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            color: '#dc2626',
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
