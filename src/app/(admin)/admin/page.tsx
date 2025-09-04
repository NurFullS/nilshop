'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await axios.get('http://localhost:8080/auth/me', { withCredentials: true });
                if (res.data.role !== 'ADMIN') {
                    router.replace('/');
                } else {
                    setLoading(false);
                }
            } catch (err) {
                router.replace('/');
            }
        }
        checkAdmin();
    }, []);

    if (loading) return <p>Загрузка...</p>;

    return (
        <div>
            
        </div>
    )
}