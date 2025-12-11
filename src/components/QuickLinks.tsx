import { QuickLink, QuickLinksProps } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect, useRef } from "react";
import { LinkModal } from "./LinkModal";
import { toast } from "sonner";

// 从枚举中导入存储键名
import { QUICK_LINKS_STORAGE_KEY } from '@/enum/quickLinks';

export const QuickLinks: React.FC<QuickLinksProps> = (
    {
        quickLinks: propQuickLinks,
        onAddLink: propOnAddLink,
        onUpdateLink: propOnUpdateLink,
        onDeleteLink: propOnDeleteLink
    }
) => {
    const {
        isDark
    } = useTheme();

    // 使用useRef来存储从props传入的回调函数，避免在依赖数组中直接使用它们
    const onAddLinkRef = useRef(propOnAddLink);
    const onUpdateLinkRef = useRef(propOnUpdateLink);
    const onDeleteLinkRef = useRef(propOnDeleteLink);
    
    // 状态管理
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0
    });
    const [selectedLink, setSelectedLink] = useState<QuickLink | null>(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    
    // 初始化时从localStorage读取数据，并与props中的数据合并
    useEffect(() => {
        const savedQuickLinks = localStorage.getItem(QUICK_LINKS_STORAGE_KEY);
        if (savedQuickLinks) {
            try {
                const parsedLinks = JSON.parse(savedQuickLinks);
                // 如果localStorage中有数据，则优先使用localStorage的数据
                if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
                    // 更新localStorage数据后同步更新props回调函数，确保父组件状态也更新
                    onAddLinkRef.current = (newLink) => {
                        const updatedLinks = [...parsedLinks, newLink];
                        localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
                        propOnAddLink(newLink);
                    };
                    
                    onUpdateLinkRef.current = (updatedLink) => {
                        const updatedLinks = parsedLinks.map(link => 
                            link.id === updatedLink.id ? updatedLink : link
                        );
                        localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
                        propOnUpdateLink(updatedLink);
                    };
                    
                    onDeleteLinkRef.current = (linkId) => {
                        const updatedLinks = parsedLinks.filter(link => link.id !== linkId);
                        localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
                        propOnDeleteLink(linkId);
                    };
                }
            } catch (error) {
                console.error('Failed to load quick links from localStorage:', error);
            }
        }
    }, [propOnAddLink, propOnUpdateLink, propOnDeleteLink]);
    
    // 当props中的quickLinks变化时，同步更新localStorage
    useEffect(() => {
        if (propQuickLinks && propQuickLinks.length > 0) {
            localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(propQuickLinks));
        }
    }, [propQuickLinks]);

    const openLink = (link: QuickLink) => {
        const url = link.url || "https://www.google.com";
        let finalUrl = url;

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            finalUrl = `https://${url}`;
        }

        window.open(finalUrl, "_blank");
    };

    const handleContextMenu = (link: QuickLink, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        setContextMenuPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });

        setSelectedLink(link);
        setContextMenuVisible(true);
    };
    
    // 删除链接
    const handleDeleteLink = () => {
        if (selectedLink) {
            // 调用ref中的函数，确保使用最新的回调实现
            onDeleteLinkRef.current(selectedLink.id);
            toast(`已删除链接：${selectedLink.name}`);
            setContextMenuVisible(false);
            setSelectedLink(null);
        }
    };

    const handleEditLink = () => {
        if (selectedLink) {
            setModalMode("edit");
            setShowLinkModal(true);
            setContextMenuVisible(false);
        }
    };

    const handleSaveLink = (link: QuickLink) => {
        if (modalMode === "edit") {
            // 调用ref中的函数，确保使用最新的回调实现
            onUpdateLinkRef.current(link);
        } else {
            // 调用ref中的函数，确保使用最新的回调实现
            onAddLinkRef.current(link);
        }
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenuVisible(false);
        };

        if (contextMenuVisible) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [contextMenuVisible]);

    return (
        <div
            className="w-[calc(100%-60px)] flex flex-wrap justify-center gap-8 my-6"
            style={{
                margin: "8px",
                padding: "8px"
            }}>
         {propQuickLinks.map(link => {
                return (
                    <div
                        key={link.id}
                        className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 group"
                        onClick={() => openLink(link)}
                         onContextMenu={e => handleContextMenu(link, e)}>
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isDark ? "bg-white/10 group-hover:bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"}`}>
                            <span className={`text-2xl font-bold ${link.color}`}>
                                {link.name && link.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span
                            className={`text-sm font-medium truncate max-w-[100px] ${isDark ? "text-white/90" : "text-gray-700"}`}>
                            {link.name}
                        </span>
                    </div>
                );
            })}
            <div
                className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 group"
                onClick={() => {
                    setModalMode("add");
                    setShowLinkModal(true);
                }}>
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isDark ? "bg-white/10 group-hover:bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"}`}>
                    <i
                        className={`fas fa-plus text-xl ${isDark ? "text-blue-400" : "text-blue-600"}`}></i>
                </div>
                <span
                    className={`text-sm font-medium truncate max-w-[100px] ${isDark ? "text-white/90" : "text-gray-700"}`}>添加链接
                                        </span>
            </div>
            {contextMenuVisible && selectedLink && <div
                className={`fixed z-50 rounded-xl shadow-xl transition-all duration-200 transform scale-100 opacity-100 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border overflow-hidden`}
                style={{
                    left: `${contextMenuPosition.x}px`,
                    top: `${contextMenuPosition.y}px`,
                    transform: "translate(-50%, -50%)",
                    margin: "45px"
                }}>
                <button
                    onClick={handleEditLink}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"} flex items-center gap-2`}>
                    <i className="fas fa-edit text-blue-500"></i>修改
                                  </button>
                <button
                    onClick={handleDeleteLink}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-red-900/30 hover:text-red-400" : "text-gray-700 hover:bg-red-50 hover:text-red-600"} flex items-center gap-2`}>
                    <i className="fas fa-trash-alt text-red-500"></i>删除
                                  </button>
            </div>}

            <LinkModal
                show={showLinkModal}
                mode={modalMode}
                link={selectedLink}
                onClose={() => {
                    setShowLinkModal(false);
                    setSelectedLink(null);
                }}
                onSave={handleSaveLink}
            />
        </div>
    );
};