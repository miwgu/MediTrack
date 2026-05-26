import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'NURSE' | 'PHARMACIST' | 'WAREHOUSE';

type RoleContextType = {
  role: Role | null;
  setRole: (role: Role) => void;
  clearRole: () => void;
}; 

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(() => {
    // Retrieve role from localStorage
    return localStorage.getItem('role') as Role | null;
  });

  const setRole = (role: Role) => {
    localStorage.setItem('role', role);  // save role to localStorage
    setRoleState(role);
  };

  const clearRole = () => {
    localStorage.clear();
    setRoleState(null);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
}