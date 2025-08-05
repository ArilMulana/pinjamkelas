import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    const handleSubMenuToggle = (itemTitle: string) => {
        setOpenSubMenu((prev) => (prev === itemTitle ? null : itemTitle));
    };

     useEffect(() => {
        // Cari item induk yang subItems-nya aktif
        const activeParent = items.find(item =>
            item.subItems?.some(subItem =>
                page.url === subItem.href || page.url.startsWith(subItem.href + '/')
            )
        );

        if (activeParent) {
            setOpenSubMenu(activeParent.title);
        } else {
            setOpenSubMenu(null); // tutup semua submenu kalau gak ada yang aktif
        }
    }, [page.url, items]);


    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {/* Jika ada subItems, klik akan toggle submenu */}
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                            onClick={item.subItems ? (e) => {
                                e.preventDefault();
                                handleSubMenuToggle(item.title);
                            }: undefined}
                        >
                            <Link
                                href={item.href}
                                className={`px-4 py-2 rounded flex items-center ${
                                    item.isActive
                                        ? 'bg-indigo-600 text-white font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {item.icon && <item.icon className="mr-2" />}
                                {item.title}
                                {/* Tanda panah kecil jika ada submenu */}
                                {item.subItems && (
                                    <span className="ml-auto">
                                        {openSubMenu === item.title ? '▲' : '▼'}
                                    </span>
                                )}
                            </Link>
                        </SidebarMenuButton>

                        {/* Submenu */}
               {item.subItems && openSubMenu === item.title && (
                <ul className="pl-4">
                    {item.subItems.map((subItem) => {
                        // Mengecek apakah subItem aktif berdasarkan URL
                       // const isActive = page.url === subItem.href || page.url.startsWith(subItem.href + '/');

                        // Log informasi tentang subItem
                        //console.log(`SubItem: ${subItem.title}, href: ${subItem.href}, isActive: ${isActive}`);

                        return (
                           <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: subItem.title }}
                            >
                                <Link
                                href={subItem.href}
                                aria-current={page.url === subItem.href ? 'page' : undefined} // Menandai 'page' jika aktif
                                className={`px-4 py-2 rounded flex items-center ${
                                    page.url === subItem.href
                                    ? 'bg-indigo-600 text-white font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                >
                                {subItem.icon && <subItem.icon className="mr-2" />}
                                {subItem.title}
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>

                        );
                    })}
                </ul>
            )}


                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
