import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BookmarkCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const  transformNestedData=(nestedData: BookmarkCategory[], hideCategory: string[]) =>{
  console.log('hideCategory___:',nestedData,hideCategory)
  const result: BookmarkCategory[] = [];
  
const bookmarkCategory:BookmarkCategory ={
  id:'bookmark',
  title:'书签',
  children:[] as BookmarkCategory[]
}
  // 遍历顶层数据
  nestedData.forEach((item: BookmarkCategory) => {
    // 创建顶层项目的副本
    const transformedItem = { ...item };

    // 处理没有children的项，直接添加到结果中
    if (!item.children) {
      // result.push(transformedItem);
      bookmarkCategory.children && bookmarkCategory.children.push(transformedItem);
      return;
    }

    // 处理有children的项
    transformedItem.children = [];

    // 递归处理嵌套的children
    if(transformedItem.title && !transformedItem.title.toLowerCase().includes("hide")){
        processChildren(item.children, transformedItem);
    }
    const tLower = (transformedItem.title ?? "").toLowerCase();
    if (hideCategory && !hideCategory.includes(transformedItem.id as string) && !tLower.includes("hide")) {
      // 添加到结果中
    result.push(transformedItem);
    }
    
  });
  if(hideCategory && !hideCategory.includes(bookmarkCategory.id as string)){
     result.unshift(bookmarkCategory);
  }

  return result;

  /**
   * 递归处理嵌套的children
   * @param {Array} children - 当前层级的children数组
   * @param {Object} parentItem - 父级项目
   * @param {string} parentTitle - 父级标题
   */
  function processChildren(children: BookmarkCategory[], parentItem: BookmarkCategory) {
    children.forEach((child: BookmarkCategory) => {
      // 创建子项的副本
      const transformedChild = { ...child };

      // 如果子项还有children，需要特殊处理
      if (child.children && child.children.length > 0) {
        // 合并父级标题到当前子项
        const mergedTitle = (child.title as string).trim() ; // 获取当前层级的标题

        // 处理更深层级的子项
        child.children.forEach((deepChild: BookmarkCategory) => {
          const deepTransformed = { ...deepChild };
          // 合并当前层级标题到深层子项
          deepTransformed.title = `${mergedTitle} - ${deepTransformed.title}`;
          // 添加到父级的children中
          (parentItem.children as BookmarkCategory[]).push(deepTransformed);
        });
      } else {
        // 直接添加子项到父级的children中
        (parentItem.children as BookmarkCategory[]).push(transformedChild);
      }
    });
  }
}
