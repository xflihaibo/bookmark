import { useContext } from 'react';
import { EnterpriseLinkContext } from '@/contexts/enterpriseLinkContext';

// 统一出口：直接使用 Context，避免重复本地状态与存储耦合
export function useEnterpriseLinks() {
  return useContext(EnterpriseLinkContext);
}
