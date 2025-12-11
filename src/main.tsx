import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";
// Import Font Awesome via npm package so Vite bundles CSS + webfonts correctly
import "@fortawesome/fontawesome-free/css/all.min.css";

// 确保DOM完全加载后再渲染应用
const initApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found. Cannot initialize the application.");
    return;
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
      <Toaster position="top-right" />
    </StrictMode>
  );
};

// 检查是否在Chrome插件环境中
const isChromeExtension = typeof (window as any).chrome !== "undefined" && (window as any).chrome.runtime;

if (isChromeExtension) {
  // 在Chrome插件环境中，确保DOM加载完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    // DOM已经加载完成
    initApp();
  }
} else {
  // 普通网页环境
  initApp();
}
