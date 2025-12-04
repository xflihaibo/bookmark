import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BOOKMARK_STORAGE_KEYS } from "@/enum/bookmarks";

export function useEnterpriseLinks() {
  const [enterpriseLinks, setEnterpriseLinks] = useState<any[]>([]);
  const [enterpriseLinkLocked, setEnterpriseLinkLocked] = useState(false);
  const [enterpriseLinkPassword, setEnterpriseLinkPassword] = useState("");

  // 检查并加载企业链接数据
  useEffect(() => {
     const loadEnterpriseLinks = () => {
      const hasEnterpriseLinks = localStorage.getItem(BOOKMARK_STORAGE_KEYS.HAS_ENTERPRISE_LINKS) === 'true';
      const savedEnterpriseLinks = localStorage.getItem(BOOKMARK_STORAGE_KEYS.ENTERPRISE_LINKS);
      const enterpriseLinkLockedStatus = localStorage.getItem(BOOKMARK_STORAGE_KEYS.ENTERPRISE_LINK_LOCKED) === 'true';
      const savedEnterpriseLinkPassword = localStorage.getItem(BOOKMARK_STORAGE_KEYS.ENTERPRISE_LINK_PASSWORD);
      
      if (hasEnterpriseLinks && savedEnterpriseLinks) {
        try {
          setEnterpriseLinks(JSON.parse(savedEnterpriseLinks));
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

    // 监听企业链接变化的自定义事件，确保侧边栏能够及时更新
    const handleEnterpriseLinksChanged = () => {
      loadEnterpriseLinks();
    };
    
    window.addEventListener('enterpriseLinksChanged', handleEnterpriseLinksChanged);
    
    return () => {
      window.removeEventListener('enterpriseLinksChanged', handleEnterpriseLinksChanged);
    };
  }, []);

  // 删除企业链接
  const handleDeleteEnterpriseLinks = () => {
     if (window.confirm("确定要删除所有企业链接吗？此操作无法撤销。")) {
      localStorage.removeItem(BOOKMARK_STORAGE_KEYS.ENTERPRISE_LINKS);
      localStorage.removeItem(BOOKMARK_STORAGE_KEYS.HAS_ENTERPRISE_LINKS);
      localStorage.removeItem(BOOKMARK_STORAGE_KEYS.ENTERPRISE_LINK_LOCKED);
      localStorage.removeItem(BOOKMARK_STORAGE_KEYS.ENTERPRISE_LINK_PASSWORD);
      setEnterpriseLinks([]);
      setEnterpriseLinkLocked(false);
      setEnterpriseLinkPassword("");
      toast("已删除所有企业链接");
    }
  };

  return {
    enterpriseLinks,
    setEnterpriseLinks,
    enterpriseLinkLocked,
    setEnterpriseLinkLocked,
    enterpriseLinkPassword,
    setEnterpriseLinkPassword,
    handleDeleteEnterpriseLinks
  };
}