import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

//引入以上配置 是英文界面需要修改zh为en

import getNavs  from "../navs/en";

import {sidebar} from '../sidebars/zh'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
    themeConfig: {
        returnToTopLabel: '返回顶部',
        // 文档页脚文本配置
        docFooter: {
            prev: 'per',
            next: 'next'
        },
        nav: getNavs(),
        sidebar,
        outline: {
            level: "deep", // 右侧大纲标题层级
            label: "On this page", // 右侧大纲标题文本配置
        },
    },
}