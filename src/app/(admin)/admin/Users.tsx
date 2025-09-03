'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type User = {
  username: string;
  email: string;
  role: string
}

export default function Home() {

  const [result, setResult] = useState<User []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/auth/users', {
          withCredentials: true
        })
        setResult(res.data)
      } catch (error) {
        return ;
      }
    }

    fetchData();  
  }, [])

  return (
    <div>
      {result && result.map((item: any) => (
        <div key={item.id}>
          <h2>{item.username}</h2>
          <p>{item.email}</p>
          <p>{item.role}</p>
        </div>
      ))}
    </div>
  );
}