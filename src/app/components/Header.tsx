'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingCart } from '@mui/icons-material'
import axios from 'axios';
import Link from 'next/link';

type User = {
    username: string;
}

const Header = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:8080/auth/me', { withCredentials: true })
                setUser(res.data)
            } catch (error) {
                setUser(null)
            }
        }
        fetchUser()
    }, [])

    return (
        <header>
            <div className='bg-gray-800 flex rounded-b-3xl p-4 items-center shadow-md'>
                <Link href="/"><h1 className="text-3xl font-bold text-white ml-10">NilShop</h1></Link>
                <div className='flex-grow flex justify-center items-center gap-10'>
                    <nav className="text-white hover:text-blue-600 cursor-pointer">Главная</nav>
                    <nav className="text-white hover:text-blue-600 cursor-pointer">Контакты</nav>
                    <nav className="text-white hover:text-blue-600 cursor-pointer">О нас</nav>
                </div>
                <div className="flex items-center gap-4 mr-10">
                    <span className="font-semibold text-white">{user ? user.username : 'Логин'}</span>
                    <ShoppingCart sx={{ width: '50px', height: '30px', cursor: 'pointer', color: 'white' }} />
                </div>
            </div>
        </header>
    )
}

export default Header
