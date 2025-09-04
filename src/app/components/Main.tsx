'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    availabilityStatus: string;
}

const Main = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const resProducts = await axios.get('http://localhost:8080/api/products', { withCredentials: true })
                setProducts(resProducts.data)
            } catch (error) {
                setErrorMessage('Ошибка при загрузке продуктов')
            }
        }
        fetchProducts()
    }, [])

    if (errorMessage) return <div className="text-red-500 text-center mt-4">{errorMessage}</div>

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Товары</h1>
            <div className="flex gap-20">
                {products.map(product => (
                    <div key={product.id} className="bg-white shadow-md rounded-2xl max-w-80 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                        <div className="w-full max-w-sm h-64 mx-auto overflow-hidden rounded-2xl shadow-md">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-64 object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-3">{product.description}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Категория: {product.category}</p>
                            <p className="text-green-600 font-bold text-lg mt-2">{product.price} ₽</p>
                            <p className={`text-sm mt-1 font-medium ${product.availabilityStatus === 'В наличии' ? 'text-green-600' : 'text-red-500'}`}>
                                {product.availabilityStatus}
                            </p>
                            <button className='bg-green-600 rounded-2xl h-10 text-white cursor-pointer mt-3'>В корзину</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Main;