import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { RoomList } from '../components/RoomList';
import { UserList } from '../components/UserList';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  className={`${
                    activeTab === 'rooms'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('rooms')}
                >
                  Rooms
                </button>
                <button
                  className={`${
                    activeTab === 'users'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
              </nav>
            </div>
            {activeTab === 'rooms' ? <RoomList /> : <UserList />}
          </div>
        </div>
      </main>
    </div>
  );
}