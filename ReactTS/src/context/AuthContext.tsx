import { createContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  details: { accessToken: string; user: User } | null;
  setdetails: (data: { accessToken: string; user: User } | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [details, setdetails] = useState<{
    accessToken: string;
    user: User;
  } | null>(null);

  return (
    <AuthContext.Provider value={{ details, setdetails }}>
      {children}
    </AuthContext.Provider>
  );
};
