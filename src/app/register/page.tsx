'use client'

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type FormValues = {
    username: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
};

const RegisterPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await axios.post('http://localhost:8080/auth/register', data, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setSuccessMessage('Регистрация успешна!');
            setErrorMessage('');
            reset();
            setTimeout(() => {
                router.replace('/login');
            }, 1000);
        } catch (err: any) {
            setErrorMessage(err.response?.data || 'Попробуйте снова.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-around min-h-screen gap-8 p-4 bg-gray-50">
            <div className="w-[400px] max-w-[400px] p-8 border border-gray-200 rounded-lg shadow-md flex flex-col items-center bg-white">
                <h2 className="text-2xl font-semibold mb-6">Регистрация</h2>

                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        id="username"
                        placeholder="Имя пользователя"
                        {...register('username', { required: 'Имя обязательно' })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email обязателен' })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                    <input
                        id="password"
                        type="password"
                        placeholder="Пароль"
                        {...register('password', { required: 'Пароль обязателен' })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    <select
                        {...register('role', { required: 'Выберите роль' })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                        defaultValue="USER"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

                    <button
                        type="submit"
                        className="mt-4 py-2 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-900 active:scale-95 transition"
                    >
                        Зарегистрироваться
                    </button>
                </form>

                {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

                <div className="mt-4 text-center">
                    <p>
                        У вас уже есть аккаунт?
                        <a href="/login" className="text-blue-700 ml-1 hover:underline">Войдите.</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
