'use client'

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  category: string;
  availabilityStatus: string;
  file: FileList;
};

const AddProductPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);
      formData.append("availabilityStatus", data.availabilityStatus);
      formData.append("file", data.file[0]);

      await axios.post('http://localhost:8080/api/products', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage("Товар успешно добавлен!");
      setErrorMessage('');
      reset();
    } catch (err: any) {
      setErrorMessage(JSON.stringify(err.response?.data) || "Ошибка при добавлении товара.");
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6">Добавить товар</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name', { required: true })} placeholder="Название" />
        <input {...register('description', { required: true })} placeholder="Описание" />
        <input type="number" {...register('price', { required: true })} placeholder="Цена" />
        <input {...register('category', { required: true })} placeholder="Категория" />
        <select {...register('availabilityStatus', { required: true })}>
          <option value="">Выберите статус</option>
          <option value="В наличии">В наличии</option>
          <option value="Нет в наличии">Нет в наличии</option>
        </select>
        <input type="file" {...register('file', { required: true })} />
        <button type="submit">Добавить</button>
      </form>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default AddProductPage;
