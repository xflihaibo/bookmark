import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { QuickLink } from "@/types";
import { QUICK_LINK_COLORS} from "@/enum/quickLinks";
interface LinkModalProps {
  show: boolean;
  mode: "add" | "edit";
  link?: QuickLink | null;
  onClose: () => void;
  onSave: (link: QuickLink) => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  show,
  mode,
  link,
  onClose,
  onSave
}) => {
  const { isDark } = useTheme();
  
  // 状态管理
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  
  // 当模态框显示或编辑的链接改变时，更新表单数据
  useEffect(() => {
    if (show) {
      if (mode === "edit" && link) {
        // 编辑模式下，填充现有链接的数据
        setLinkName(link.name);
        setLinkUrl(link.url || "");
      } else {
        // 添加模式下，重置表单
        setLinkName("");
        setLinkUrl("");
      }
    }
  }, [show, mode, link]);

  
  // 处理URL输入变化
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLinkUrl(url);
  };
  
  // 处理保存链接
  const handleSave = () => {
    if (!linkName.trim()) {
      toast("请输入链接名称");
      return;
    }
    
    const newLink: QuickLink = {
      id: mode === "edit" && link ? link.id : Date.now(),
      name: linkName.trim(),
      color: mode === "edit" && link ? link.color : QUICK_LINK_COLORS[Math.floor(Math.random() * QUICK_LINK_COLORS.length)],
      url: linkUrl.trim()
    };
    
    onSave(newLink);
    
    // 重置表单
    setLinkName("");
    setLinkUrl("");
    onClose();
    
    // toast(`已${mode === "add" ? "添加" : "更新"}链接：${newLink.name}`);
  };
  
  // 处理模态框背景点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // 如果模态框不显示，返回null
  if (!show) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOverlayClick}>
      <div
        className={`p-4 rounded-xl w-full max-w-md ${isDark ? "bg-black/30 backdrop-blur-md border-white/10" : "bg-white/80 backdrop-blur-md border-gray-200"} border shadow-xl`}
        onClick={e => e.stopPropagation()}>
        <h3
          className={`text-center font-medium mb-3 ${isDark ? "text-white" : "text-gray-800"}`}>
          {mode === "add" ? "添加新链接" : "修改链接"}
        </h3>
        <input
          type="text"
          value={linkName}
          onChange={e => setLinkName(e.target.value)}
          placeholder="输入链接名称"
          className={`w-full px-4 py-2 rounded-lg mt-6 mb-6 ${isDark ? "bg-white/10 text-white border-white/10" : "bg-white text-gray-800 border-gray-300"} border focus:outline-none focus:ring-2 focus:ring-blue-500`} />
        <input
          type="text"
          value={linkUrl}
          onChange={handleUrlChange}
          placeholder="输入链接URL (可选，会自动获取图标)"
          className={`w-full px-4 py-2 rounded-lg mt-2 mb-10 ${isDark ? "bg-white/10 text-white border-white/10" : "bg-white text-gray-800 border-gray-300"} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onKeyDown={e => e.key === "Enter" && handleSave()} />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-lg transition-colors ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>
            取消
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-2 rounded-lg transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
            {mode === "add" ? "添加" : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
};