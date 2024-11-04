'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import isAuth from '@/components/isAuth'
import pb from '@/app/pocketbase'
import { RecordModel } from 'pocketbase'
import { format, parseISO, formatISO } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { useRouter } from 'next/navigation'

const AdminPage = () => {
  const [events, setEvents] = useState<RecordModel[]>([])
  const [users, setUsers] = useState<RecordModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({ name: '', date: '', venue: '', sport: '' })

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const convertToUTC = (localDateString: string): string => {
    const localDate = parseISO(localDateString)
    const utcDate = fromZonedTime(localDate, localTimeZone)
    return formatISO(utcDate, { format: 'extended' })
  }

  const convertToLocal = (utcDateString: string): string => {
    const utcDate = parseISO(utcDateString)
    const localDate = toZonedTime(utcDate, localTimeZone)
    return format(localDate, "yyyy-MM-dd'T'HH:mm")
  }

  const router = useRouter();

  if (!pb.authStore.isAdmin) {
    router.push('/browse/events')
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const eventsData = await pb.collection('events').getList(1, 50, { sort: '+date' })
        const usersData = await pb.collection('users').getList(1, 50)
        setEvents(eventsData.items)
        setUsers(usersData.items)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const utcDate = convertToUTC(newEvent.date)
      const eventData = {
        ...newEvent,
        date: utcDate
      }
      const createdEvent = await pb.collection('events').create(eventData)
      setEvents([...events, createdEvent])
      setIsEventDialogOpen(false)
      setNewEvent({ name: '', date: '', venue: '', sport: '' })
      toast({ title: "Success", description: "Event created successfully" })
    } catch (error) {
      console.error('Error creating event:', error)
      toast({ title: "Error", description: "Failed to create event", variant: "destructive" })
    }
  }

  const handleRemoveEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      try {
        await pb.collection('events').delete(id)
        setEvents(events.filter(event => event.id !== id))
        toast({ title: "Success", description: "Event removed successfully" })
      } catch (error) {
        console.error('Error removing event:', error)
        toast({ title: "Error", description: "Failed to remove event", variant: "destructive" })
      }
    }
  }

  const handleRemoveUser = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await pb.collection('users').delete(id)
        setUsers(users.filter(user => user.id !== id))
        toast({ title: "Success", description: "User removed successfully" })
      } catch (error) {
        console.error('Error removing user:', error)
        toast({ title: "Error", description: "Failed to remove user", variant: "destructive" })
      }
    }
  }

  return (
    <div className='bg-gradient-to-b from-blue-100 to-white min-h-screen'>
        <div className="container mx-auto p-4 ">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <Tabs defaultValue="events">
            <TabsList>
              <TabsTrigger value="events">Manage Events</TabsTrigger>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Events
                    <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Create New Event</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Event Name</Label>
                            <Input
                              id="name"
                              value={newEvent.name}
                              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="date">Date (Local Time)</Label>
                            <Input
                              id="date"
                              type="datetime-local"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                              id="venue"
                              value={newEvent.venue}
                              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="sport">Sport</Label>
                            <Select
                              value={newEvent.sport}
                              onValueChange={(value) => setNewEvent({ ...newEvent, sport: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a sport" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basketball">Basketball</SelectItem>
                                <SelectItem value="football">Football</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit">Create Event</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Loading events...</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Date (Local Time)</TableHead>
                          <TableHead>Venue</TableHead>
                          <TableHead>Sport</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{format(parseISO(convertToLocal(event.date)), 'PPpp')}</TableCell>
                            <TableCell>{event.venue}</TableCell>
                            <TableCell>{event.sport}</TableCell>
                            <TableCell>
                              <Button variant="destructive" onClick={() => handleRemoveEvent(event.id)}>Remove</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Loading users...</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Seller Rating</TableHead>
                          <TableHead>Detials</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.seller_rating}</TableCell>
                            <TableCell>{user.details}</TableCell>
                            <TableCell>
                              <Button variant="destructive" onClick={() => handleRemoveUser(user.id)}>Remove</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Toaster />
        </div>
    </div>
  )
}

export default isAuth(AdminPage)