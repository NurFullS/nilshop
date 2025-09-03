'use client'

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type FormValues = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await axios.post('http://localhost:8080/auth/login', data, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            setSuccessMessage('Успешный вход!');
            setErrorMessage('');
            setTimeout(() => {
                router.replace('/');
            }, 1000)
        } catch (err: any) {
            setErrorMessage(err.response?.data || 'Ошибка при входе. Попробуйте снова.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen gap-8 p-4 bg-gray-50">

            <div className="w-full max-w-md sm:max-w-sm p-8 border border-gray-200 rounded-lg shadow-md flex flex-col items-center bg-white">
                <h2 className="text-2xl font-semibold mb-6">Вход</h2>

                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email обязателен' })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                    <input
                        id='password'
                        type="password"
                        placeholder="Пароль"
                        {...register('password', { required: 'Пароль обязателен' })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    <button
                        type="submit"
                        className="mt-4 cursor-pointer py-2 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-900 active:scale-95 transition"
                    >
                        Войти
                    </button>
                </form>

                {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 mt-4 text-center">{successMessage}</p>}
                <div className="mt-4 text-center">
                    <p>
                        У вас нет аккаунта?
                        <a href="/register" className="text-blue-700 ml-1 hover:underline">Зарегистрируйтесь.</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
