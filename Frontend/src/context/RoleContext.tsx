import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'NURSE' | 'PHARMACIST' | 'WAREHOUSE';

type RoleContextType = {
  role: Role | null;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
}