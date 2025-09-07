//import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
//import { BookOpen, Folder } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: route('dashboard'), // Pastikan ini path relatif atau full URL sesuai kebutuhan
    routeName: 'dashboard',
    // icon: LayoutGrid,
  },

  {
    title: 'User',
    href: route('user'),
    routeName: ['user'],
  },
  {
    title: 'Infrastruktur',
    href: '#',
    routeName: ['building', 'floor', 'room'],
    subItems: [
      {
        title: 'Gedung',
        href: '/dashboard/building',
        routeName: ['building', 'create-building'],
      },
      {
        title: 'Lantai',
        href: '/dashboard/floor', // Ganti route('floor') jadi path string langsung
        routeName: ['floor', 'create-floor'],
      },
      {
        title: 'Ruangan',
        href: '/dashboard/room', // Ganti route('room') jadi path string langsung
        routeName: ['room', 'create-room'],
      },
    ],
  },
  {
      title: 'Fakultas',
        href: route('fakultas'),  // Perbaiki href yang sebelumnya kosong
        routeName: 'fakultas',
  },
  {
    title: 'Akademik',
    href: '#',
    routeName: [ 'Matakuliah', 'Matakuliah Prodi'],
    subItems: [
      {
        title: 'Matakuliah',
        href: '/dashboard/matkul',
        routeName: 'matkul',
      },

      {
        title:'Matakuliah Per Program Studi',
        href:'/dashboard/matkul/prodi',
        routeName:'Matakuliah Prodi'
      },
      {
        title:'Jadwal Matakuliah',
        href:'/dashboard/matkul/jadwal',
        routeName:'jadwal-matkul'
      }
    ],
  },

];

// const footerNavItems: NavItem[] = [
//   {
//     title: 'Repository',
//     href: 'https://github.com/laravel/react-starter-kit',
//     icon: Folder,
//   },
//   {
//     title: 'Documentation',
//     href: 'https://laravel.com/docs/starter-kits#react',
//     icon: BookOpen,
//   },
// ];

export function AppSidebar() {
  const { url } = usePage();

  // Fungsi untuk cek apakah route aktif menggunakan Ziggy route().current()
  const isRouteActive = (routeName: string | string[] | undefined): boolean => {
    if (!routeName) return false;
    if (Array.isArray(routeName)) {
      return routeName.some((name) => route().current(name));
    }
    return route().current(routeName);
  };

  // Update items dengan flag isActive
  const updatedMainNavItems = mainNavItems.map((item) => {
    const isRouteMatch = isRouteActive(item.routeName);

    const isSubItemActive = item.subItems
      ? item.subItems.some((subItem) => isRouteActive(subItem.routeName))
      : false;

    // Cek juga url.startsWith jika kamu mau fallback cek url
    const isHrefActive = item.href && item.href !== '#' ? url.startsWith(item.href) : false;

    return {
      ...item,
      isActive: isRouteMatch || isSubItemActive || isHrefActive,
    };
  });

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={updatedMainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
