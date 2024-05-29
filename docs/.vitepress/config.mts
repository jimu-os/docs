import {defineConfig} from 'vitepress'
import {zhConfig} from "./config/zh";
import {themeConfig} from "./theme";
import {head} from "../../head";
import {docsConfig} from "./docs";
import {enConfig} from "./config/en";


// themeConfig: {
//     // https://vitepress.dev/reference/default-theme-config
//     nav: [
//         {text: '指南', link: '/cn/guide/intro'},
//         {
//             text: 'v0.4.1',
//             items: [
//                 {text: '更新日志', link: '...'},
//             ]
//         },
//     ],
//         search: {
//         provider: 'local'
//     },
//
//     locales: {
//         zh: {
//             label: '简体中文',
//                 lang: 'zh'
//         },
//         en: {
//             label: 'English',
//                 lang: 'en',
//         }
//     },
//
//     sidebar: [
//         {
//             text: '指南',
//             items: [
//                 {text: '简介', link: '/zh/guide/intro'},
//                 {text: '快速上手', link: '/zh/guide/start'},
//                 {text: '插件', link: '/zh/guide/plugin'}
//             ]
//         }
//     ],
//
//         socialLinks: [
//         {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
//     ],
//         docFooter: {
//         prev: '上一页',
//             next: '下一页'
//     },
//     outline: {
//         level: "deep", // 右侧大纲标题层级
//             label: "目录", // 右侧大纲标题文本配置
//     },
// }

// https://vitepress.dev/reference/site-config
export default defineConfig({
    /* 文档配置 */

    ...docsConfig,
    themeConfig,

    /* 语言配置 */
    locales: {
        root: {
            label: '简体中文',
            lang: 'zh-CN',
            link: '/zh/', ...zhConfig
        },
        // zh: {label: '简体中文', lang: 'zh-CN', link: '/zh/', ...zhConfig},
        en: {label: 'English', lang: 'en-US', link: '/en/', ...enConfig},
    },
})
