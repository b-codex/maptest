import React from 'react'
import { Layout, Menu } from 'antd';
const {Sider } = Layout;

export default function SideMenu() {
    const items = [
        { label: 'item 1', key: 'item-1' }, // remember to pass the key prop
        { label: 'item 2', key: 'item-2' }, // which is required
        {
            label: 'sub menu',
            key: 'submenu',
            children: [{ label: 'item 3', key: 'submenu-item-1' }],
        },
    ];
    return (
        <Sider>
            <Menu items={items} />;
        </Sider>
    )
}
