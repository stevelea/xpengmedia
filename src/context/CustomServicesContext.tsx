import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { CustomService } from '../types/database';
import { debouncedSyncCustomServices, fetchCustomServicesFromCloud } from '../services/syncService';

interface CustomServicesContextType {
  customServices: CustomService[];
  addService: (service: Omit<CustomService, 'id' | 'created_at'>) => void;
  removeService: (id: string) => void;
  updateService: (id: string, updates: Partial<Omit<CustomService, 'id'>>) => void;
}

const CustomServicesContext = createContext<CustomServicesContextType | undefined>(undefined);

const STORAGE_KEY = 'xpeng-custom-services';

export const CustomServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [customServices, setCustomServices] = useState<CustomService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [hasLoadedFromCloud, setHasLoadedFromCloud] = useState(false);

  // Load from cloud when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id && !hasLoadedFromCloud) {
      fetchCustomServicesFromCloud(user.id).then(cloudServices => {
        if (cloudServices && cloudServices.length > 0) {
          setCustomServices(cloudServices);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudServices));
        }
        setHasLoadedFromCloud(true);
      });
    }
  }, [isAuthenticated, user?.id, hasLoadedFromCloud]);

  // Save to localStorage and sync to cloud
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customServices));

    if (isAuthenticated && user?.id && hasLoadedFromCloud) {
      debouncedSyncCustomServices(user.id, customServices);
    }
  }, [customServices, isAuthenticated, user?.id, hasLoadedFromCloud]);

  const addService = useCallback((service: Omit<CustomService, 'id' | 'created_at'>) => {
    const newService: CustomService = {
      ...service,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    setCustomServices(prev => [...prev, newService]);
  }, []);

  const removeService = useCallback((id: string) => {
    setCustomServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateService = useCallback((id: string, updates: Partial<Omit<CustomService, 'id'>>) => {
    setCustomServices(prev => prev.map(s =>
      s.id === id ? { ...s, ...updates } : s
    ));
  }, []);

  return (
    <CustomServicesContext.Provider value={{ customServices, addService, removeService, updateService }}>
      {children}
    </CustomServicesContext.Provider>
  );
};

export const useCustomServices = (): CustomServicesContextType => {
  const context = useContext(CustomServicesContext);
  if (!context) {
    throw new Error('useCustomServices must be used within a CustomServicesProvider');
  }
  return context;
};

export default CustomServicesContext;
