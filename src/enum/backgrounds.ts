// 本地背景图片（直接引用 src/assest/backgroundImg 下的资源）
// 注意：项目中路径目录为 "assest"（非 assets）。如需改名，请同步更新此处导入路径。

import bg01 from '@/assest/backgroundImg/background-01.png';
import bg02 from '@/assest/backgroundImg/background-02.png';
import bg03 from '@/assest/backgroundImg/background-03.png';
import bg04 from '@/assest/backgroundImg/background-04.png';
import bg05 from '@/assest/backgroundImg/background-05.png';
import bg06 from '@/assest/backgroundImg/background-06.png';
import bg07 from '@/assest/backgroundImg/background-07.png';
import bg08 from '@/assest/backgroundImg/background-08.png';
import bg09 from '@/assest/backgroundImg/background-09.png';
import bg10 from '@/assest/backgroundImg/background-10.png';

// 预设背景图片列表（可按需调整顺序）
export const presetBackgrounds: string[] = [
  bg01,
  bg02,
  bg03,
  bg04,
  bg05,
  bg06,
  bg07,
  bg08,
  bg09,
  bg10,
];

// 默认背景（取第一张或指定）
export const defaultBackgroundImage: string = presetBackgrounds[0] || '';
