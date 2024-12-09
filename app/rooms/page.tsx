'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/src/components/ui/table'
import { useToast } from '@/src/components/ui/use-toast'

type Room = {
  id: number
  number: string
  type: string
  price: number
}

type RoomFormProps = {
  onSubmit: (room: Room) => void
  initialData?: Room
}

function RoomForm({ onSubmit, initialData }: RoomFormProps) {
  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    number: initialData?.number || '',
    type: initialData?.type || '',
    price: initialData?.price || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, id: initialData?.id || 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {['number', 'type', 'price'].map((field) => (
        <div key={field} className="relative">
          <Input
            type={field === 'price' ? 'number' : 'text'}
            id={field}
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            required
            min={field === 'price' ? '0' : undefined}
            step={field === 'price' ? '0.01' : undefined}
            className="block w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          />
          <Label
            htmlFor={field}
            className="absolute left-4 -top-3 px-1 bg-black text-xs text-gray-400"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Label>
        </div>
      ))}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
      >
        {initialData ? 'Update' : 'Add'} Room
      </Button>
    </form>
  )
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/rooms', {
        headers: {
          'Authorization': `${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch rooms')
      }
      const data = await response.json()
      setRooms(data)
      return data
    } catch (error) {
      console.error('Error fetching rooms:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms. Please try again.',
        variant: 'destructive',
      })
      return []
    }
  }

  const handleAddRoom = async (newRoom: Omit<Room, 'id'>) => {
    const existingRooms = await fetchRooms()
    if (existingRooms.some((room: { number: string }) => room.number === newRoom.number)) {
      toast({
        title: 'Error',
        description: 'Room number already exists. Please choose a different number.',
        variant: 'destructive',
      })
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(newRoom),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add room')
      }
      const addedRoom = await response.json()
      setRooms((prevRooms) => [...prevRooms, addedRoom])
      setIsAddDialogOpen(false)
      toast({
        title: 'Room Added',
        description: `Room ${addedRoom.number} has been added successfully.`,
      })
    } catch (error) {
      console.error('Error adding room:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add room. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleEditRoom = async (updatedRoom: Room) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/rooms/${updatedRoom.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(updatedRoom),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update room')
      }
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
      )
      setIsEditDialogOpen(false)
      setEditingRoom(null)
      toast({
        title: 'Room Updated',
        description: `Room ${updatedRoom.number} has been updated successfully.`,
      })
    } catch (error) {
      console.error('Error updating room:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update room. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteRoom = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete room')
      }
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id))
      toast({
        title: 'Room Deleted',
        description: 'The room has been deleted successfully.',
      })
    } catch (error) {
      console.error('Error deleting room:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete room. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Room Management
          </h1>
          <div className="mb-6">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Room
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold">Room Number</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">Type</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">Price</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">Actions</span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.number}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>${room.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingRoom(room)
                            setIsEditDialogOpen(true)
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Add New Room
            </h2>
            <p className="text-center text-gray-400 mb-4">
              Fill in the details for the new room.
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Existing Room Numbers:</h3>
              <div className="max-h-32 overflow-y-auto">
                {rooms.map(room => (
                  <span key={room.id} className="inline-block bg-gray-800 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                    {room.number}
                  </span>
                ))}
              </div>
            </div>
            <RoomForm onSubmit={(room) => {
              handleAddRoom(room as Room)
            }} />
            <Button onClick={() => setIsAddDialogOpen(false)} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isEditDialogOpen && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Edit Room
            </h2>
            <p className="text-center text-gray-400 mb-4">
              Update the details for the room.
            </p>
            <RoomForm onSubmit={(room) => {
              handleEditRoom(room)
              setIsEditDialogOpen(false)
            }} initialData={editingRoom} />
            <Button onClick={() => setIsEditDialogOpen(false)} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

