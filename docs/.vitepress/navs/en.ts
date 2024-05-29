import type {DefaultTheme} from "vitepress";

export default function getNavs() {
    return [
        {text: 'Home', link: '/en'},
        {text: 'Guide', link: '/en/guide/intro'},
        {
            text: 'v0.4.1',
            items: [
                {text: 'Update', link: '/en/update/update.md'},
            ]
        },
    ] as DefaultTheme.NavItem[]
};