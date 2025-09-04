'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import { Delete } from '@mui/icons-material';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function Users() {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/auth/users', {
          withCredentials: true
        });
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/auth/users/${id}`, {
        withCredentials: true
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      {users.map((user) => (
        <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center shadow-sm bg-white w-full max-w-md">
          <div>
            <h2 className="font-semibold">Имя: {user.username}</h2>
            <p className="text-sm text-gray-600">Email: {user.email}</p>
            <p className="text-sm text-gray-500">Роль: {user.role}</p>
          </div>
          <button 
            className="text-red-500 hover:text-red-700 transition cursor-pointer" 
            onClick={() => handleDeleteUser(user.id)}
          >
            <Delete />
          </button>
        </div>
      ))}
    </div>
  );
}
