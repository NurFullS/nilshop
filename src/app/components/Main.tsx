'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from './Header'

type Product = {
    id: number
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
    availabilityStatus: string
}

const Main = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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

    const handleAddBasket = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation()

        const storedCart = localStorage.getItem('cart')
        const cart: (Product & { quantity: number })[] = storedCart ? JSON.parse(storedCart) : []

        const existing = cart.find(item => item.id === product.id)
        if (existing) {
            existing.quantity += 1
        } else {
            cart.push({ ...product, quantity: 1 })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
    }

    const handleOpenProduct = (product: Product) => {
        setSelectedProduct(product)
        document.body.style.overflow = 'hidden'
    }

    const handleCloseProduct = () => {
        setSelectedProduct(null)
        document.body.style.overflow = 'auto'
    }

    return (
        <>
            <Header />
            <div className="p-6">
                <div className="flex gap-20 flex-wrap justify-center">
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleOpenProduct(product)}
                            className="rounded-2xl max-w-80 overflow-hidden flex flex-col duration-300 cursor-pointer"
                        >
                            <div className="w-[350px] bg-gray-100 max-w-sm h-64 mx-auto overflow-hidden shadow-md">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-64 object-contain transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">Категория: {product.category}</p>
                                <p className="text-green-600 font-bold text-lg mt-2">{product.price} KGS</p>
                                <p className={`text-sm mt-1 font-medium ${product.availabilityStatus === 'В наличии' ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.availabilityStatus}
                                </p>
                                <button
                                    onClick={(e) => handleAddBasket(e, product)}
                                    className={`text-[18px] ${product.availabilityStatus === "Нет в наличии" ? 'hidden' : 'bg-gray-900'} text-white h-10 hover:bg-gray-800 cursor-pointer mt-3`}
                                >
                                    Купить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleCloseProduct}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-64 object-contain mb-4" />
                        <p className="mb-4">{selectedProduct.description}</p>
                        <p className="text-green-600 font-bold text-lg">{selectedProduct.price} KGS</p>
                        <div className='flex gap-4 justify-between'>
                            <button
                                onClick={(e) => handleAddBasket(e, selectedProduct)}
                                className={`mt-4 px-4 py-2 ${selectedProduct.availabilityStatus === "Нет в наличии" ? 'hidden' : 'bg-green-600'} text-white rounded-lg cursor-pointer`}
                            >
                                В корзину
                            </button>
                            <button
                                onClick={handleCloseProduct}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Main
