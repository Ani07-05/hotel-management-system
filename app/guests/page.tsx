'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/src/components/ui/table'
import { useToast } from '@/src/components/ui/use-toast'

type Guest = {
  id: number
  name: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
}

type GuestFormProps = {
  onSubmit: (guest: Guest) => void
  initialData?: Guest
}

function GuestForm({ onSubmit, initialData }: GuestFormProps) {
  const [formData, setFormData] = useState<Omit<Guest, 'id'>>({
    name: initialData?.name || '',
    roomNumber: initialData?.roomNumber || '',
    checkInDate: initialData?.checkInDate || '',
    checkOutDate: initialData?.checkOutDate || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, id: initialData?.id || 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {['name', 'roomNumber', 'checkInDate', 'checkOutDate'].map((field) => (
        <div key={field} className="relative">
          <Input
            type={field.includes('Date') ? 'date' : 'text'}
            id={field}
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            required
            className="block w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.split(/(?=[A-Z])/).join(' ')}
          />
          <Label
            htmlFor={field}
            className="absolute left-4 -top-3 px-1 bg-gray-900 text-xs text-gray-400"
          >
            {field.split(/(?=[A-Z])/).join(' ')}
          </Label>
        </div>
      ))}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
      >
        {initialData ? 'Update' : 'Add'} Guest
      </Button>
    </form>
  )
}

export default function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/guests', {
        headers: {
          'Authorization': `${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch guests')
      }
      const data = await response.json()
      setGuests(data)
    } catch (error) {
      console.error('Error fetching guests:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch guests. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleAddGuest = async (newGuest: Omit<Guest, 'id'>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(newGuest),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add guest')
      }
      const addedGuest = await response.json()
      setGuests((prevGuests) => [...prevGuests, addedGuest])
      setIsAddDialogOpen(false)
      toast({
        title: 'Guest Added',
        description: `${addedGuest.name} has been added successfully.`,
      })
    } catch (error) {
      console.error('Error adding guest:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add guest. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleEditGuest = async (updatedGuest: Guest) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/guests/${updatedGuest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(updatedGuest),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update guest')
      }
      setGuests((prevGuests) =>
        prevGuests.map((guest) => (guest.id === updatedGuest.id ? updatedGuest : guest))
      )
      setIsEditDialogOpen(false)
      setEditingGuest(null)
      toast({
        title: 'Guest Updated',
        description: `${updatedGuest.name}'s information has been updated successfully.`,
      })
    } catch (error) {
      console.error('Error updating guest:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update guest. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteGuest = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/guests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete guest')
      }
      setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== id))
      toast({
        title: 'Guest Deleted',
        description: 'The guest has been deleted successfully.',
      })
    } catch (error) {
      console.error('Error deleting guest:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete guest. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Guest Management
        </h1>
        <div className="mb-6">
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New Guest
          </Button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Room Number</TableHead>
                <TableHead>Check-in Date</TableHead>
                <TableHead>Check-out Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.name}</TableCell>
                  <TableCell>{guest.roomNumber}</TableCell>
                  <TableCell>{guest.checkInDate}</TableCell>
                  <TableCell>{guest.checkOutDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingGuest(guest)
                          setIsEditDialogOpen(true)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGuest(guest.id)}
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

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Add New Guest
            </h2>
            <p className="text-center text-gray-400 mb-4">
              Fill in the details for the new guest.
            </p>
            <GuestForm onSubmit={(guest) => {
              handleAddGuest(guest as Guest)
            }} />
            <Button onClick={() => setIsAddDialogOpen(false)} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isEditDialogOpen && editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Edit Guest
            </h2>
            <p className="text-center text-gray-400 mb-4">
              Update the details for the guest.
            </p>
            <GuestForm onSubmit={(guest) => {
              handleEditGuest(guest)
              setIsEditDialogOpen(false)
            }} initialData={editingGuest} />
            <Button onClick={() => setIsEditDialogOpen(false)} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

