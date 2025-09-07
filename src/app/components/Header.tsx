'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingCart } from '@mui/icons-material'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type User = {
    username: string
    role: string
}

type Product = {
    id: number
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
    availabilityStatus: string
    quantity: number
}

const Header = () => {
    const [user, setUser] = useState<User | null>(null)
    const [cart, setCart] = useState<Product[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:8080/auth/me', { withCredentials: true })
                setUser(res.data)
            } catch {
                setUser(null)
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) setCart(JSON.parse(storedCart))
    }, [])

    const handleRemoveFromCart = (id: number) => {
        const updatedCart = cart.filter(item => item.id !== id)
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const updateQuantity = (id: number, type: 'inc' | 'dec') => {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1)
                }
            }
            return item
        })
        setCart(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    const handleNavAdmin = () => {
        if (!user) {
            router.push('/login');
        } else if (user.role === 'ADMIN') {
            router.push('/admin/products');
        } else {
            setIsOpenProfile(!isOpenProfile);
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true })
            setUser(null)
        } catch (error) {
            console.error('Ошибка при выходе из системы', error)
        }
    }

    return (
        <header>
            <div className="bg-gray-800 flex rounded-b-3xl p-4 items-center shadow-md justify-between">
                <Link href="/"><h1 className="text-3xl font-bold text-white ml-10">NilShop</h1></Link>
                <div className="flex items-center gap-4 mr-10 relative">
                    <span onClick={handleNavAdmin} className="font-semibold cursor-pointer text-white font-mono text-[20px]">{user ? user.username : 'Логин'}</span>
                    <div className="relative">
                        <ShoppingCart
                            sx={{ width: '50px', height: '30px', cursor: 'pointer', color: 'white' }}
                            onClick={() => setIsCartOpen(!isCartOpen)}
                        />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </div>

                    {isCartOpen && (
                        <div className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-xl p-4 z-50">
                            <h3 className="text-lg font-bold mb-2">Корзина</h3>
                            {cart.length === 0 ? (
                                <p className="text-gray-500">Корзина пуста</p>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex gap-3 items-center border-b pb-2">
                                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain" />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                    <p className="text-gray-500 text-sm">{item.price} ₽</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <button onClick={() => updateQuantity(item.id, 'dec')} className="px-2 bg-gray-200 rounded">-</button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 'inc')} className="px-2 bg-gray-200 rounded">+</button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                    className="text-red-500 font-semibold hover:text-red-700"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 font-bold text-left flex gap-2">
                                        Общая сумма: <p className='text-green-600'>{totalPrice} ₽</p>
                                    </div>
                                </>
                            )}
                            <Link href="/purchase"><p className='text-blue-600 text-center mt-4'>Перейти к оплате</p></Link>
                        </div>
                    )}
                </div>
                {isOpenProfile && <div className='absolute top-16 right-20 bg-white p-4 rounded shadow-md flex flex-col gap-2'>
                    <button onClick={handleLogout}>Выйти</button>
                </div>}
            </div>
        </header>
    )
}

export default Header
