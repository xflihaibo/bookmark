import Home from "@/pages/Home";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { ThemeProvider } from '@/contexts/themeContext';
import { EnterpriseLinkProvider } from '@/contexts/enterpriseLinkContext';

export default function App() {
  // 认证状态暂时设为已认证，以便直接显示主页内容
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <ThemeProvider>
          <EnterpriseLinkProvider>
            <Home />
          </EnterpriseLinkProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
