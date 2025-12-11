import { createContext } from "react";
import { AuthContextType } from "@/types";

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => { void value; },
  logout: () => {},
});