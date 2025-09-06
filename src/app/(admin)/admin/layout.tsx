'use client'

import Header from '@/app/components/Header';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();


  const menu = [
    { name: 'Добавить товар', path: '/admin/addproduct' },
    { name: 'Товары', path: '/admin/products' },
    { name: 'Аналитика', path: '/admin/analytics' },
    { name: 'Пользователи', path: '/admin/users' },
  ];

  return (
    <>
    <Header />
      <div className="flex">
        <aside className="w-60 h-100 bg-gray-800 rounded-br-2xl rounded-tr-2xl mt-30 text-white flex flex-col">
          <Link href="/admin"><h2 className="text-2xl font-bold p-6 border-b border-gray-700">Админ панель</h2></Link>
          <nav className="flex flex-col p-4 gap-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${pathname === item.path ? 'bg-gray-700 font-semibold' : ''
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mt-auto mx-4 mb-4 px-4 py-2 text-center bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Главная
          </Link>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;