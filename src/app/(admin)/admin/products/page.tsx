'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Delete, Edit, Save, Close } from '@mui/icons-material'

type Products = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  availabilityStatus: string;
}

const Page = () => {
  const [products, setProducts] = useState<Products[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resProducts = await axios.get('http://localhost:8080/api/products', { withCredentials: true })
        setProducts(resProducts.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProducts()
  }, [])

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`, { withCredentials: true })
      setProducts(products.filter(product => product.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateProduct = async (id: number, updatedData: FormData) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/products/${id}`, updatedData, { withCredentials: true })
      setProducts(products.map(p => p.id === id ? res.data : p))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Наши продукты</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-280">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onDelete={handleDeleteProduct} 
            onUpdate={handleUpdateProduct} 
          />
        ))}
      </div>
    </div>
  )
}

type ProductCardProps = {
  product: Products
  onDelete: (id: number) => void
  onUpdate: (id: number, updatedData: FormData) => void
}

const ProductCard = ({ product, onDelete, onUpdate }: ProductCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price)
  const [category, setCategory] = useState(product.category)
  const [availabilityStatus, setAvailabilityStatus] = useState(product.availabilityStatus)
  const [file, setFile] = useState<File | null>(null)

  const handleSave = () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price.toString())
    formData.append('category', category)
    formData.append('availabilityStatus', availabilityStatus)
    if (file) formData.append('file', file)
    onUpdate(product.id, formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price)
    setCategory(product.category)
    setAvailabilityStatus(product.availabilityStatus)
    setFile(null)
  }

  return (
    <div className="bg-white shadow-md rounded-2xl w-auto overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="w-full h-56 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-64 object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input className="border p-1 rounded" value={name} onChange={e => setName(e.target.value)} />
            <textarea className="border p-1 rounded" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="number" className="border p-1 rounded" value={price} onChange={e => setPrice(Number(e.target.value))} />
            <input className="border p-1 rounded" value={category} onChange={e => setCategory(e.target.value)} />
            <select className="border p-1 rounded" value={availabilityStatus} onChange={e => setAvailabilityStatus(e.target.value)}>
              <option>В наличии</option>
              <option>Нет в наличии</option>
            </select>
            <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
            <p className="text-blue-600 font-bold text-lg mt-2">{product.price} KGS</p>
            <p className="text-sm text-gray-500 mt-1">Категория: {product.category}</p>
            <p className={`text-sm mt-1 font-medium ${product.availabilityStatus === 'В наличии' ? 'text-green-600' : 'text-red-500'}`}>
              {product.availabilityStatus}
            </p>
          </div>
        )}
        <div className="mt-4 flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
                <Save /> Сохранить
              </button>
              <button onClick={handleCancel} className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 flex items-center justify-center gap-2">
                <Close /> Отмена
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 flex items-center justify-center gap-2">
                <Edit /> Редактировать
              </button>
              <button onClick={() => onDelete(product.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                <Delete /> Удалить
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page;