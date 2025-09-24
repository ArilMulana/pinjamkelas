 import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 md:p-12">
        <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-5">
                <Link
                href={route('home')}
                className="flex flex-col items-center gap-3 font-semibold text-indigo-700 dark:text-indigo-400 hover:scale-105 transition-transform duration-300"
                >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900 shadow-md">
                    <AppLogoIcon className="h-9 w-9 fill-current text-indigo-700 dark:text-indigo-300" />
                </div>
                <span className="sr-only">{title}</span>
                </Link>

                <div className="space-y-2 text-center">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                    {description}
                </p>
                </div>
            </div>
            {children}
            </div>
        </div>
        </div>

    );
}
