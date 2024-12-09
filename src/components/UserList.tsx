import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  role: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('/api/users');
    setUsers(response.data);
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/users', newUser);
    setNewUser({ username: '', password: '', role: '' });
    fetchUsers();
  };

  const updateUser = async (id: number, role: string) => {
    await axios.put(`/api/users/${id}`, { role });
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    await axios.delete(`/api/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <form onSubmit={addUser} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <input
          type="text"
          placeholder="Role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add User
        </button>
      </form>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {user.role}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
                <button
                  onClick={() => updateUser(user.id, user.role === 'admin' ? 'user' : 'admin')}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}