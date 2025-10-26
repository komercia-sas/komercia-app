'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { CompanyInfo, getCompanyInfo } from '@/lib/vercel-blob';

interface CompanyContextType {
  companyInfo: CompanyInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const companyInfo = await fetch('/api/company');
      const companyInfoData = await companyInfo.json();
      setCompanyInfo(companyInfoData);
    } catch (err) {
      console.error('Error fetching company info:', err);
      setError('Error al cargar la información de la empresa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const refetch = async () => {
    await fetchCompanyInfo();
  };

  return (
    <CompanyContext.Provider value={{ companyInfo, loading, error, refetch }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
