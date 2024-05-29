import type {DefaultTheme} from "vitepress";

export default function getNavs() {
    return [
        {text: 'Home', link: '/'},
        {text: 'Guide', link: '/zh/guide/intro'},
        {
            text: 'v0.4.1',
            items: [
                {text: 'Update', link: '...'},
            ]
        },
    ] as DefaultTheme.NavItem[]
};