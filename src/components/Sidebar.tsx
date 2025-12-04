// 导入独立的模态框组件
import { LockModal } from './LockModal';
import { UnlockModal } from './UnlockModal';


import { useState, useEffect, useRef } from "react";
import { MenuItem, SidebarProps } from "@/types";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { BookmarkManagementModal } from "./BookmarkManagementModal";
import { MenuModal } from "./MenuModal";
import { useEnterpriseLinks } from "@/hooks/useEnterpriseLinks";
import { availableIcons } from '@/enum/menuItems';

export const Sidebar: React.FC<SidebarProps> = (
    {
        menuItems,
        setMenuItems,
        activeMenuItem,
        setActiveMenuItem,
        setShowSettingsPanel,
        sidebarMode
    }
) => {
    const { isDark } = useTheme();
    const { enterpriseLinks, enterpriseLinkLocked, enterpriseLinkPassword, setEnterpriseLinkLocked, setEnterpriseLinkPassword, handleDeleteEnterpriseLinks } = useEnterpriseLinks();
    
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [menuModalMode, setMenuModalMode] = useState<"add" | "edit">("add");
    const [showBookmarkManagement, setShowBookmarkManagement] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

    // 从枚举中导入可用图标

    // 处理鼠标悬停显示/隐藏侧边栏
    useEffect(() => {
        const sidebarElement = sidebarRef.current;
        if (!sidebarElement) return;

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        sidebarElement.addEventListener("mouseenter", handleMouseEnter);
        sidebarElement.addEventListener("mouseleave", handleMouseLeave);
        
        return () => {
            sidebarElement.removeEventListener("mouseenter", handleMouseEnter);
            sidebarElement.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // 点击外部关闭右键菜单
    useEffect(() => {
        const handleClickOutside = () => setContextMenuVisible(false);
        
        if (contextMenuVisible) {
            document.addEventListener("click", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [contextMenuVisible]);

    const shouldShowSidebar = sidebarMode === "always" || (sidebarMode === "hover" && isHovered);

    // 处理菜单项点击
    const handleMenuItemClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        
        // 检查菜单项是否被锁定
        if (id === "enterprise" && enterpriseLinkLocked) {
            // 企业链接特殊处理
            setSelectedMenuItem({ id: "enterprise", icon: "fa-briefcase", label: "企业链接" });
            setShowUnlockModal(true);
        } else {
            const menuItem = menuItems.find(item => item.id === id);
            if (menuItem && menuItem.locked) {
                setSelectedMenuItem(menuItem);
                setShowUnlockModal(true);
            } else {
                setActiveMenuItem(id);
            }
        }
    };

    // 处理企业链接右键菜单
    const handleEnterpriseLinkContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        setContextMenuPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });

        // 创建一个虚拟的菜单项对象，用于在右键菜单中表示企业链接
        const enterpriseMenuItem: MenuItem = {
            id: "enterprise",
            icon: "fa-briefcase",
            label: "企业链接",
            locked: enterpriseLinkLocked
        };

        setSelectedMenuItem(enterpriseMenuItem);
        setContextMenuVisible(true);
    };

    // 处理普通菜单项右键菜单
    const handleContextMenu = (item: MenuItem, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        setContextMenuPosition({
            x: rect.left + rect.width / 2+20,
            y: rect.top + rect.height / 2+20
        });

        setSelectedMenuItem(item);
        setContextMenuVisible(true);
    };

    // 删除菜单项
    const handleDeleteMenuItem = () => {
        if (!selectedMenuItem) return;
        
        if (menuItems.length <= 1) {
            toast("至少需要保留一个菜单项");
            setContextMenuVisible(false);
            return;
        }

        if (selectedMenuItem.id === "home") {
            toast("首页菜单项不能删除");
            setContextMenuVisible(false);
            return;
        }

        // 检查当前要删除的菜单项是否为选中状态
        if (activeMenuItem === selectedMenuItem.id) {
            toast("当前选中的菜单项不能删除");
            setContextMenuVisible(false);
            return;
        }

        const updatedMenuItems = menuItems.filter(item => item.id !== selectedMenuItem.id);
        setMenuItems(updatedMenuItems);

        toast(`已删除菜单项：${selectedMenuItem.label}`);
        setContextMenuVisible(false);
    };

    // 锁定菜单项
    const handleLockMenuItem = () => {
        if (selectedMenuItem && selectedMenuItem.id !== "home") {
            setShowLockModal(true);
            setContextMenuVisible(false);
        }
    };

    // 解锁菜单项
    const handleUnlockMenuItem = () => {
        if (selectedMenuItem && selectedMenuItem.id !== "home") {
            setShowUnlockModal(true);
            setContextMenuVisible(false);
        }
    };

    // 保存锁定密码
    const saveLockPassword = () => {
        if (!passwordInput || passwordInput !== confirmPasswordInput) {
            toast("两次输入的密码不一致，请重新输入");
            return;
        }

        if (selectedMenuItem) {
            if (selectedMenuItem.id === "enterprise") {
                // 处理企业链接的锁定
                setEnterpriseLinkLocked(true);
                setEnterpriseLinkPassword(passwordInput);
                localStorage.setItem('enterpriseLinkLocked', 'true');
                localStorage.setItem('enterpriseLinkPassword', passwordInput);
                toast(`已锁定企业链接`);
            } else {
                // 处理普通菜单项的锁定
                const updatedMenuItems = menuItems.map(item => 
                    item.id === selectedMenuItem.id 
                        ? { ...item, locked: true, password: passwordInput } 
                        : item
                );
                setMenuItems(updatedMenuItems);
                toast(`已锁定菜单项：${selectedMenuItem.label}`);
            }
            setShowLockModal(false);
            setPasswordInput("");
            setConfirmPasswordInput("");
        }
    };

    // 验证解锁密码
    const verifyUnlockPassword = () => {
        if (!selectedMenuItem) return;
        
        if (selectedMenuItem.id === "enterprise") {
            // 处理企业链接的解锁
            if (passwordInput === enterpriseLinkPassword) {
                setEnterpriseLinkLocked(false);
                setEnterpriseLinkPassword("");
                localStorage.removeItem('enterpriseLinkLocked');
                localStorage.removeItem('enterpriseLinkPassword');
                toast(`已解锁企业链接`);
                setShowUnlockModal(false);
                setPasswordInput("");
                // 如果当前是想访问企业链接，则直接激活
                setActiveMenuItem("enterprise");
            } else {
                toast("密码错误，请重新输入");
            }
        } else {
            // 处理普通菜单项的解锁
            const menuItem = menuItems.find(item => item.id === selectedMenuItem.id);
            if (menuItem && menuItem.password === passwordInput) {
                const updatedMenuItems = menuItems.map(item => 
                    item.id === selectedMenuItem.id 
                        ? { ...item, locked: false, password: undefined } 
                        : item
                );
                setMenuItems(updatedMenuItems);
                toast(`已解锁菜单项：${selectedMenuItem.label}`);
                setShowUnlockModal(false);
                setPasswordInput("");
            } else {
                toast("密码错误，请重新输入");
            }
        }
    };

     // 编辑菜单项
    const handleEditMenuItem = () => {
        if (selectedMenuItem) {
            setMenuModalMode("edit");
            setShowMenuModal(true);
            setContextMenuVisible(false);
        }
    };

     // 保存编辑后的菜单项
    const handleUpdateMenuItem = (updatedItem: MenuItem) => {
        setMenuItems(menuItems.map(item => 
            item.id === updatedItem.id ? updatedItem : item
        ));
        setShowMenuModal(false);
    };

    return (
        <>
            <div
                ref={sidebarRef}
                className={`fixedleft-0 top-0 bottom-0 w-[60px] md:w-[60px] z-30 flex flex-col items-center py-6 gap-8 transition-all duration-300 ${shouldShowSidebar ? "translate-x-0" : "-translate-x-full"}`}>
                <div
                    className={`absolute inset-0 backdrop-blur-lg ${isDark ? "bg-black/20" : "bg-white/10"}`}></div>
                 
                 <div className="relative z-10 flex flex-col items-center gap-8 w-[70px] pt-2.5 pb-2.5">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={e => handleMenuItemClick(item.id, e)}
                            onContextMenu={e => handleContextMenu(item, e)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative
                                ${activeMenuItem === item.id 
                                    ? (isDark ? "bg-white/30 text-white" : "bg-white/40 text-gray-800") + " scale-110 rounded-full" 
                                    : (isDark ? "text-white/70 hover:text-white" : "text-gray-700 hover:text-gray-900") + " hover:bg-white/20"}`}
                            title={item.label}
                            type="button">
                            <i className={`fas ${item.icon} text-xl transition-transform duration-300 hover:scale-110`}></i>
                        </button>
                    ))}
                    
                    {/* 企业链接图标 - 当有企业链接时显示 */}
                    {enterpriseLinks.length > 0 && (
                        <button
                            onClick={(e) => handleMenuItemClick("enterprise", e)}
                            onContextMenu={(e) => handleEnterpriseLinkContextMenu(e)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative
                                ${activeMenuItem === "enterprise"
                                    ? (isDark ? "bg-white/30 text-white" : "bg-white/40 text-gray-800") + " scale-110" 
                                    : (isDark ? "text-white/70 hover:text-white" : "text-gray-700 hover:text-gray-900") + " hover:bg-white/20"}`}
                            title="企业链接"
                            type="button">
                            <i className="fas fa-briefcase text-xl transition-transform duration-300 hover:scale-110"></i>
                        </button>
                    )}
                </div>
                
                <div className="relative z-10 mt-auto">
                     <button
                        onClick={() => {
                            setMenuModalMode("add");
                            setShowMenuModal(true);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isDark ? "text-white/70 hover:text-white" : "text-gray-700 hover:text-gray-900"} hover:bg-white/20`}>
                        <i className="fas fa-plus text-xl transition-transform duration-300 hover:scale-110"></i>
                    </button>
                </div>
                
                <div className="relative z-10">
                    <button
                        onClick={() => setShowSettingsPanel(true)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isDark ? "text-white/70 hover:text-white" : "text-gray-700 hover:text-gray-900"} hover:bg-white/20`}>
                        <i className="fas fa-cog text-xl transition-transform duration-300 hover:rotate-90"></i>
                    </button>
                </div>
            </div>
            
            {/* 侧边栏触发器 - 当侧边栏处于悬停模式且未悬停时显示 */}
            {sidebarMode === "hover" && !isHovered && (
                <div
                    className="fixed left-0 top-0 bottom-0 w-[2px] bg-transparent z-30 cursor-pointer flex items-center justify-center"
                    onMouseEnter={() => setIsHovered(true)}>
                    <div className="w-2 h-16 rounded-r-full bg-blue-500 opacity-80 shadow-md transition-all duration-300 hover:opacity-100"></div>
                </div>
            )}
            
            {/* 右键菜单 */}
            {contextMenuVisible && selectedMenuItem && (
                <div
                    className={`fixed z-50 rounded-xl shadow-xl transition-all duration-200 transform scale-100 opacity-100 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border overflow-hidden`}
                    style={{
                        left: `${contextMenuPosition.x}px`,
                        top: `${contextMenuPosition.y}px`,
                        transform: "translate(-50%, -50%)",
                        margin: "51px"
                    }}>
                    {selectedMenuItem.id !== "enterprise" && (
                        <button
                            onClick={handleEditMenuItem}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"} flex items-center gap-2`}>
                            <i className="fas fa-edit text-blue-500"></i>修改
                        </button>
                    )}
                    
                    {selectedMenuItem.id !== "enterprise" && (
                        <button
                            onClick={() => {
                                setShowBookmarkManagement(true);
                                setContextMenuVisible(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"} flex items-center gap-2`}>
                            <i className="fas fa-bookmark text-green-500"></i>书签显示管理
                        </button>
                    )}
                    
                    {selectedMenuItem.id !== "home" && (
                        <>
                            {!selectedMenuItem.locked ? (
                                <button
                                    onClick={handleLockMenuItem}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-yellow-900/30 hover:text-yellow-400" : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"} flex items-center gap-2`}>
                                    <i className="fas fa-lock text-yellow-500"></i>锁定菜单
                                </button>
                            ) : (
                                <button
                                    onClick={handleUnlockMenuItem}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-green-900/30 hover:text-green-400" : "text-gray-700 hover:bg-green-50 hover:text-green-600"} flex items-center gap-2`}>
                                    <i className="fas fa-unlock text-green-500"></i>解锁菜单
                                </button>
                            )}
                            
                            {selectedMenuItem.id === "enterprise" ? (
                                activeMenuItem !== "enterprise" && (
                                    <button
                                        onClick={() => {
                                            handleDeleteEnterpriseLinks();
                                            setContextMenuVisible(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-red-900/30 hover:text-red-400" : "text-gray-700 hover:bg-red-50 hover:text-red-600"} flex items-center gap-2`}>
                                        <i className="fas fa-trash-alt text-red-500"></i>删除
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={handleDeleteMenuItem}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-red-900/30 hover:text-red-400" : "text-gray-700 hover:bg-red-50 hover:text-red-600"} flex items-center gap-2`}>
                                    <i className="fas fa-trash-alt text-red-500"></i>删除
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
            
            {/* 锁定菜单模态框 */}
            {showLockModal && (
                <LockModal
                    isDark={isDark}
                    selectedMenuItem={selectedMenuItem}
                    passwordInput={passwordInput}
                    confirmPasswordInput={confirmPasswordInput}
                    setPasswordInput={setPasswordInput}
                    setConfirmPasswordInput={setConfirmPasswordInput}
                    saveLockPassword={saveLockPassword}
                    onClose={() => {
                        setShowLockModal(false);
                        setPasswordInput("");
                        setConfirmPasswordInput("");
                    }}
                />
            )}
            
            {/* 解锁菜单模态框 */}
            {showUnlockModal && (
                <UnlockModal
                    isDark={isDark}
                    selectedMenuItem={selectedMenuItem}
                    passwordInput={passwordInput}
                    setPasswordInput={setPasswordInput}
                    verifyUnlockPassword={verifyUnlockPassword}
                    onClose={() => {
                        setShowUnlockModal(false);
                        setPasswordInput("");
                    }}
                />
            )}
            
            {/* 书签管理模态框 */}
            {showBookmarkManagement && (
                <BookmarkManagementModal
                    show={showBookmarkManagement}
                    onClose={() => setShowBookmarkManagement(false)}
                    activeTab={selectedMenuItem?.id || 'home'}
                />
            )}
             
              {/* 统一的菜单管理模态框 */}
              <MenuModal
                  show={showMenuModal}
                  onClose={() => setShowMenuModal(false)}
                  onAdd={(newItem) => {
                    setMenuItems([...menuItems, newItem]);
                  }}
                  onUpdate={handleUpdateMenuItem}
                  mode={menuModalMode}
                  selectedMenuItem={selectedMenuItem}
              />
        </>
    );
};