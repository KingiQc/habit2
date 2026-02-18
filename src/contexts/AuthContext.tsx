import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types/habit";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (user: User) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  signup: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("habit-current-user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("habit-current-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("habit-current-user");
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem("habit-users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const signup = (newUser: User): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem("habit-users") || "[]");
    if (users.some((u) => u.email === newUser.email)) return false;
    users.push(newUser);
    localStorage.setItem("habit-users", JSON.stringify(users));
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
