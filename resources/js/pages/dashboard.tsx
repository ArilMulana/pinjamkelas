
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ReactNode } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


interface DashboardProps{
    children:ReactNode;

}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];


export default function Dashboard({ children }:DashboardProps) {
    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <Head title="Dashboard" /> */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="bg-gray-100 relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                            { children }
                </div>
            </div>
        </AppLayout>
    );
}
