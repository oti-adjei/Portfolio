import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'admin@avachen.com',
  password: 'admin123'
};

const AUTH_STORAGE_KEY = 'admin_auth_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.email && data.timestamp) {
          const hoursSinceLogin = (Date.now() - data.timestamp) / (1000 * 60 * 60);
          if (hoursSinceLogin < 24) {
            setIsAuthenticated(true);
            setUser({ email: data.email });
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = {
        email,
        timestamp: Date.now()
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      setUser({ email });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
