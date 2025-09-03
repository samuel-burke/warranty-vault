// AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User;
  logout: () => void;
}

// Just one default user for now
const demoUser: User = {
  id: 1,
  email: "demo@company.com",
  name: "Demo User",
  createdAt: "2024-01-01",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(demoUser);

  const logout = () => {
    // You might not even need logout if skipping auth
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
