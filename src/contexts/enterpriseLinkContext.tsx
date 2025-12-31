import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { EnterpriseLinkContextType, EnterpriseLink } from "@/types";
import { ENTERPRISE_LINK_STORAGE_KEYS } from "@/enum/enterpriseLinks";

interface EnterpriseLinkProviderProps {
  children: ReactNode;
}

export const EnterpriseLinkContext = createContext<EnterpriseLinkContextType>({
  enterpriseLinks: [],
  setEnterpriseLinks: () => {},
  enterpriseLinkLocked: false,
  setEnterpriseLinkLocked: () => {},
  enterpriseLinkPassword: "",
  setEnterpriseLinkPassword: () => {},
  handleDeleteEnterpriseLinks: () => {}
});

export const EnterpriseLinkProvider: React.FC<EnterpriseLinkProviderProps> = ({ children }) => {
  const [enterpriseLinks, setEnterpriseLinks] = useState<EnterpriseLink[]>([]);
  const [enterpriseLinkLocked, setEnterpriseLinkLocked] = useState(false);
  const [enterpriseLinkPassword, setEnterpriseLinkPassword] = useState("");

  // 初始化：检查并加载企业链接数据
  useEffect(() => {
     const loadEnterpriseLinks = () => {
      const hasEnterpriseLinks = localStorage.getItem(ENTERPRISE_LINK_STORAGE_KEYS.HAS) === 'true';
      const savedEnterpriseLinks = localStorage.getItem(ENTERPRISE_LINK_STORAGE_KEYS.LINKS);
      const enterpriseLinkLockedStatus = localStorage.getItem(ENTERPRISE_LINK_STORAGE_KEYS.LOCKED) === 'true';
      const savedEnterpriseLinkPassword = localStorage.getItem(ENTERPRISE_LINK_STORAGE_KEYS.PASSWORD);
      
      if (hasEnterpriseLinks && savedEnterpriseLinks) {
        try {
          setEnterpriseLinks(JSON.parse(savedEnterpriseLinks) as EnterpriseLink[]);
        } catch (error) {
          console.error('Failed to load enterprise links:', error);
        }
      }
      
      if (savedEnterpriseLinkPassword) {
        setEnterpriseLinkPassword(savedEnterpriseLinkPassword);
      }
      
      setEnterpriseLinkLocked(enterpriseLinkLockedStatus);
    };

    // 立即检查一次
    loadEnterpriseLinks();

    // 监听企业链接变化的自定义事件（向后兼容），确保其他组件能够及时更新
    const handleEnterpriseLinksChanged = () => {
      loadEnterpriseLinks();
    };
    
    window.addEventListener('enterpriseLinksChanged', handleEnterpriseLinksChanged);
    
    return () => {
      window.removeEventListener('enterpriseLinksChanged', handleEnterpriseLinksChanged);
    };
  }, []);

  // 持久化：enterpriseLinks 变化时写入本地存储并标记 HAS（不再派发事件，避免自触发循环）
  useEffect(() => {
    try {
      localStorage.setItem(ENTERPRISE_LINK_STORAGE_KEYS.LINKS, JSON.stringify(enterpriseLinks));
      localStorage.setItem(ENTERPRISE_LINK_STORAGE_KEYS.HAS, enterpriseLinks.length > 0 ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to persist enterprise links:', e);
    }
  }, [enterpriseLinks]);

  // 持久化：锁定状态与密码
  useEffect(() => {
    localStorage.setItem(ENTERPRISE_LINK_STORAGE_KEYS.LOCKED, enterpriseLinkLocked ? 'true' : 'false');
  }, [enterpriseLinkLocked]);

  useEffect(() => {
    if (enterpriseLinkPassword) {
      localStorage.setItem(ENTERPRISE_LINK_STORAGE_KEYS.PASSWORD, enterpriseLinkPassword);
    } else {
      localStorage.removeItem(ENTERPRISE_LINK_STORAGE_KEYS.PASSWORD);
    }
  }, [enterpriseLinkPassword]);

  // 删除企业链接
  const handleDeleteEnterpriseLinks = () => {
     if (window.confirm("确定要删除所有企业链接吗？此操作无法撤销。")) {
      localStorage.removeItem(ENTERPRISE_LINK_STORAGE_KEYS.LINKS);
      localStorage.removeItem(ENTERPRISE_LINK_STORAGE_KEYS.HAS);
      localStorage.removeItem(ENTERPRISE_LINK_STORAGE_KEYS.LOCKED);
      localStorage.removeItem(ENTERPRISE_LINK_STORAGE_KEYS.PASSWORD);
      setEnterpriseLinks([]);
      setEnterpriseLinkLocked(false);
      setEnterpriseLinkPassword("");
      toast("已删除所有企业链接");
      // 派发事件，通知依赖方
      window.dispatchEvent(new Event('enterpriseLinksChanged'));
    }
  };

  return (
    <EnterpriseLinkContext.Provider value={{ enterpriseLinks, setEnterpriseLinks, enterpriseLinkLocked, setEnterpriseLinkLocked, enterpriseLinkPassword, setEnterpriseLinkPassword, handleDeleteEnterpriseLinks }}>
      {children}
    </EnterpriseLinkContext.Provider>
  );
};
