// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, AuthResponse } from "@/api/auth";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<any | null>(() => {
    const raw = localStorage.getItem("current_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem("access_token"));
      const raw = localStorage.getItem("current_user");
      setUser(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener("authchange", handler);
    return () => window.removeEventListener("authchange", handler);
  }, []);

  const login = async (email: string, password: string) => {
    const res: AuthResponse & { user?: any } = await authApi.login({
      email,
      password,
    });
    setToken(res.accessToken);
    setUser(res.user ?? null);
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
