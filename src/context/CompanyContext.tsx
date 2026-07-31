'use client';

import React, { createContext, useContext, useState } from 'react';

export interface CompanyContextType {
  companyId: number | null;
  userId: string | null;
  userRole: string | null;
  setCompany: (companyId: number, userId: string, userRole: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyId, setCompanyId] = useState<number | null>(
    typeof window !== 'undefined' ? parseInt(localStorage.getItem('companyId') || '') || null : null
  );
  const [userId, setUserId] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('userId') || null : null
  );
  const [userRole, setUserRole] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('userRole') || null : null
  );

  const value: CompanyContextType = {
    companyId,
    userId,
    userRole,
    setCompany: (cId, uId, role) => {
      setCompanyId(cId);
      setUserId(uId);
      setUserRole(role);
      localStorage.setItem('companyId', cId.toString());
      localStorage.setItem('userId', uId);
      localStorage.setItem('userRole', role);
    },
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within CompanyProvider');
  }
  return context;
};
