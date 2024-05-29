import type {DefaultTheme} from "vitepress";
import {sidebar} from "./sidebars/zh";

export const themeConfig: DefaultTheme.Config = {
    i18nRouting: true,
    logo: "/public/logo_1.svg",
    nav: [
        {text: '主页', link: '/zh/guide/intro'},
        {text: '指南', link: '/zh/guide/intro'},
        {
            text: 'v0.4.1',
            items: [
                {text: '更新日志', link: '...'},
            ]
        },
    ],
    returnToTopLabel: '返回顶部',
    // 文档页脚文本配置
    docFooter: {
        prev: '上一页',
        next: '下一页'
    },

    sidebar,
    outline: {
        level: "deep", // 右侧大纲标题层级
        label: "目录", // 右侧大纲标题文本配置
    },
    // 搜索配置（二选一）
    search: {
        // 本地离线搜索
        provider: "local",
        // 多语言搜索配置
        options: {
            locales: {
                /* 默认语言 */
                zh: {
                    translations: {
                        button: {
                            buttonText: "搜索",
                            buttonAriaLabel: "搜索文档",
                        },
                        modal: {
                            noResultsText: "无法找到相关结果",
                            resetButtonTitle: "清除查询结果",
                            footer: {
                                selectText: "选择",
                                navigateText: "切换",
                            },
                        },
                    },

                },
                en: {
                    translations: {
                        button: {
                            buttonText: "Search",
                            buttonAriaLabel: "Search for Documents",
                        },
                        modal: {
                            noResultsText: "Unable to find relevant results",
                            resetButtonTitle: "Clear Query Results",
                            footer: {
                                selectText: "select",
                                navigateText: "switch",
                            },
                        },
                    },
                },
            },
        },
    },
};
