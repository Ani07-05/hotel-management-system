import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <img src="/hotel.jpg" alt="Hotel" className="w-full max-w-2xl mx-auto mb-8 rounded-lg shadow-lg" />
        <h1 
          className={`text-4xl font-bold mb-4 transition-opacity duration-1000 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Welcome to the Hotel Management System
        </h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}