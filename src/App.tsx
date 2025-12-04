import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { ThemeProvider } from '@/contexts/themeContext';
import { BookmarkProvider } from '@/contexts/bookmarkContext';
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
        <BookmarkProvider>
          <EnterpriseLinkProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
            </Routes>
          </EnterpriseLinkProvider>
        </BookmarkProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
