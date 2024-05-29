import type {DefaultTheme} from "vitepress";

export default function getNavs() {
    return [
        {text: '主页', link: '/'},
        {text: '指南', link: '/zh/guide/intro'},
        {
            text: 'v0.4.1',
            items: [
                {text: '更新日志', link: '...'},
            ]
        },
    ] as DefaultTheme.NavItem[]
};