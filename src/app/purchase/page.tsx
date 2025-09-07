'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    availabilityStatus: string;
    quantity: number;
};

const PurchasePage = () => {
    const [cart, setCart] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    useEffect(() => {
        const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(sum);
    }, [cart]);

    const increaseQuantity = (id: number) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        const fetchCheckout = async () => {
            try {
                await axios.post('http://localhost:8080/api/products/pay', {
                    products: cart.map(item => ({ id: item.id, quantity: item.quantity })),
                    total: total
                }, { withCredentials: true
                })
            } catch (error) {
                console.error('Ошибка при оформлении заказа', error);
            }
        }

        fetchCheckout();
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        alert('Спасибо за покупку!');
        localStorage.removeItem('cart');
        setCart([]);
        router.push('/');
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500">Ваша корзина пуста</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-3 items-center border-b pb-2">
                                <img src={item.imageUrl} alt={item.name} className="w-32 h-32 object-contain rounded-lg" />
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">{item.name}</h2>
                                    <p className="text-gray-500">Цена: {item.price} ₽</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <button onClick={() => decreaseQuantity(item.id)} className="px-3 py-1 bg-gray-200 rounded">-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => increaseQuantity(item.id)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 mt-2 hover:underline">
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-100 w-100 p-6 rounded-lg shadow-lg h-fit">
                        <form action="">

                            <div className='flex gap-6 mb-6'>
                                <input type="email" placeholder='Email...' className='w-40 border border-blue-600 outline-none p-2' required />
                                <input type="text" placeholder='Имя...' className='w-40 border border-blue-600 outline-none p-2' required />
                            </div>
                            <input type="text" placeholder='Номер карты...' className=' border border-blue-600 outline-none p-2 w-86 mb-4' required />
                            <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
                            <p className="text-lg mb-4">Всего товаров: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                            <p className="text-2xl font-bold text-green-600 mb-6">Итог: {total} ₽</p>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700 transition"
                            >
                                Оформить заказ
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchasePage;
