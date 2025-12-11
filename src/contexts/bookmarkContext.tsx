// import { createContext, useState, useEffect, ReactNode } from 'react';
// import { BookmarkCategory, BookmarkVisibilitySettings, BookmarkContextType } from "@/types";

// interface BookmarkProviderProps {
//   children: ReactNode;
// }

// export const BookmarkContext = createContext<BookmarkContextType>({
//   bookmarks: [],
//   hiddenCategories: {},
//   setHiddenCategories: () => {},
//   hideCategory: () => {},
//   showCategory: () => {},
//   isCategoryHidden: () => false
// });

// export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
//   const [bookmarks, setBookmarks] = useState<BookmarkCategory[]>([]);
//   const [hiddenCategories, setHiddenCategories] = useState<BookmarkVisibilitySettings>({});

//   // 初始化书签数据
//   useEffect(() => {
//     // 从本地存储加载隐藏的分类设置
//     const savedHiddenCategories = localStorage.getItem('hiddenBookmarkCategories');
//     if (savedHiddenCategories) {
//       try {
//         setHiddenCategories(JSON.parse(savedHiddenCategories));
//       } catch (error) {
//         console.error('Failed to load hidden bookmark categories:', error);
//       }
//     }

//     // 在实际应用中，这里可能会从API或本地存储加载书签数据
//     // 由于我们没有看到直接加载书签数据的逻辑，暂时保持为空数组
//   }, []);

//   // 当隐藏分类发生变化时，保存到本地存储
//   // useEffect(() => {
//   //   // localStorage.setItem('hiddenBookmarkCategories', JSON.stringify(hiddenCategories));
//   // }, [hiddenCategories]);

//   // 隐藏指定标签页下的分类
//   const hideCategory = (tabId: string, category: string) => {
//     setHiddenCategories(prev => {
//       const currentHidden = prev[tabId] || [];
//       if (!currentHidden.includes(category)) {
//         return {
//           ...prev,
//           [tabId]: [...currentHidden, category]
//         };
//       }
//       return prev;
//     });
//   };

//   // 显示指定标签页下的分类
//   const showCategory = (tabId: string, category: string) => {
//     setHiddenCategories(prev => {
//       const currentHidden = prev[tabId] || [];
//       return {
//         ...prev,
//         [tabId]: currentHidden.filter(item => item !== category)
//       };
//     });
//   };

//   // 检查指定标签页下的分类是否被隐藏
//   const isCategoryHidden = (tabId: string, category: string) => {
//     const currentHidden = hiddenCategories[tabId] || [];
//     return currentHidden.includes(category);
//   };

//   return (
//     <BookmarkContext.Provider value={{ bookmarks, hiddenCategories, setHiddenCategories, hideCategory, showCategory, isCategoryHidden }}>
//       {children}
//     </BookmarkContext.Provider>
//   );
// };