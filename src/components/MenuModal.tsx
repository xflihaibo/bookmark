import { useState } from "react";
import { toast } from "sonner";
import { MenuItem, MenuModalProps } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { availableIcons } from '@/enum/menuItems';

export const MenuModal: React.FC<MenuModalProps> = (
    {
        show,
        onClose,
        onAdd,
        onUpdate,
        mode,
        selectedMenuItem
    }
) => {
    const {
        isDark
    } = useTheme();

    const [menuName, setMenuName] = useState(mode === "edit" && selectedMenuItem ? selectedMenuItem.label : "");
    const [selectedIcon, setSelectedIcon] = useState(mode === "edit" && selectedMenuItem ? selectedMenuItem.icon : "fa-plus");

    // 从枚举中导入可用图标

    if (!show)
        return null;

    const handleSave = () => {
        if (menuName.trim() && selectedIcon) {
            if (mode === "add") {
                const newItem: MenuItem = {
                    id: `custom-${Date.now()}`,
                    icon: selectedIcon,
                    label: menuName.trim()
                };

                onAdd(newItem);
                toast(`已添加新菜单项：${newItem.label}`);
            } else if (mode === "edit" && selectedMenuItem) {
                const updatedItem: MenuItem = {
                    ...selectedMenuItem,
                    icon: selectedIcon,
                    label: menuName.trim()
                };

                onUpdate(updatedItem);
                toast(`已更新菜单项：${updatedItem.label}`);
            }
            
            setShowMenuModal(false);
        } else {
            toast("请输入菜单名称并选择图标");
        }
    };

    const setShowMenuModal = (value: boolean) => {
        if (!value) {
            setMenuName("");
            setSelectedIcon("fa-plus");
        }

        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div
                className={`w-full max-w-[640px] rounded-2xl overflow-hidden shadow-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <div
                    className={`p-5 flex justify-between items-center border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <h2
                        className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                        {mode === "add" ? "添加分组" : "修改分组"}
                    </h2>
                    <button
                        onClick={() => setShowMenuModal(false)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="p-5">
                    <div className="mb-6">
                        <div className="grid grid-cols-10 gap-3 mb-4">
                            {availableIcons.map((icon, index) => <button
                                key={icon + index} // 使用icon+index作为key，避免key冲突
                                onClick={() => setSelectedIcon(icon)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${selectedIcon === icon ? `${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"} scale-110` : `${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}`}>
                                <i className={`fas ${icon}`}></i>
                            </button>)}
                        </div>
                    </div>
                    <div className="mb-6">
                        <input
                            type="text"
                            value={menuName}
                            onChange={e => setMenuName(e.target.value)}
                            placeholder="请输入分组名称"
                            className={`w-full border rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-800 focus:ring-blue-300"}`} />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowMenuModal(false)}
                            className={`py-2 px-6 rounded-lg transition-colors ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>取消
                        </button>
                        <button
                            onClick={handleSave}
                            className={`py-2 px-6 rounded-lg transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>确认
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};