import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Room {
  id: number;
  number: string;
  type: string;
  occupied: boolean;
}

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState({ number: '', type: '' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await axios.get('/api/rooms');
    setRooms(response.data);
  };

  const addRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/rooms', newRoom);
    setNewRoom({ number: '', type: '' });
    fetchRooms();
  };

  const updateRoom = async (id: number, occupied: boolean) => {
    await axios.put(`/api/rooms/${id}`, { occupied });
    fetchRooms();
  };

  const deleteRoom = async (id: number) => {
    await axios.delete(`/api/rooms/${id}`);
    fetchRooms();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Rooms</h2>
      <form onSubmit={addRoom} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Room number"
          value={newRoom.number}
          onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <input
          type="text"
          placeholder="Room type"
          value={newRoom.type}
          onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Room
        </button>
      </form>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Number
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {room.number}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {room.type}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    room.occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {room.occupied ? 'Occupied' : 'Available'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
                <button
                  onClick={() => updateRoom(room.id, !room.occupied)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Toggle Status
                </button>
                <button
                  onClick={() => deleteRoom(room.id)}
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