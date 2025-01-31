'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TbBallBasketball, TbBallAmericanFootball, TbTicket, TbBuildingStadium, TbList } from "react-icons/tb"
import isAuth from '@/components/isAuth'
import pb from '@/app/pocketbase'
import { RecordModel } from 'pocketbase'
import { Calendar } from 'lucide-react'

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

const BrowseEventsPage: React.FC = () => {
  const [events, setEvents] = useState<RecordModel[]>([]);
  const [selectedSport, setSelectedSport] = useState<'basketball' | 'football' | 'all' | null>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      pb.autoCancellation(false);
      setIsLoading(true);
      try {
        const records = await pb.collection('events').getList(1, 10, {
          sort: '+date',
          expand: 'tickets',
          filter: 'active=true'
        });
        setEvents(records.items);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    (selectedSport === 'all' || event.sport === selectedSport) &&
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const SkeletonCard = () => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow border border-border rounded-lg">
      <CardHeader className="bg-muted text-card-foreground p-4">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Events</h1>

        <div className="flex space-x-4 mb-4">
          <Toggle
            pressed={selectedSport === 'all'}
            onPressedChange={() => setSelectedSport('all')}
            className={`bg-secondary text-secondary-foreground ${selectedSport === 'all' ? 'ring-2 ring-ring' : ''}`}
          >
            <TbList className="mr-2 h-4 w-4" />
            All
          </Toggle>
          <Toggle
            pressed={selectedSport === 'basketball'}
            onPressedChange={() => setSelectedSport('basketball')}
            className={`bg-secondary text-secondary-foreground ${selectedSport === 'basketball' ? 'ring-2 ring-ring' : ''}`}
          >
            <TbBallBasketball className="mr-2 h-4 w-4" />
            Basketball
          </Toggle>
          <Toggle
            pressed={selectedSport === 'football'}
            onPressedChange={() => setSelectedSport('football')}
            className={`bg-secondary text-secondary-foreground ${selectedSport === 'football' ? 'ring-2 ring-ring' : ''}`}
          >
            <TbBallAmericanFootball className="mr-2 h-4 w-4" />
            Football
          </Toggle>
        </div>

        <Input
          type="search"
          placeholder="Search events..."
          className="mb-4 bg-input text-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            filteredEvents.map(event => {
              // Filter out tickets from the current user
              const availableTickets = event.expand?.tickets.filter((ticket: { seller_id: string }) => ticket.seller_id !== pb.authStore.model?.id) || [];
              console.log(availableTickets)
              return (
                <Link href={`/browse/events/${event.id}`} key={event.id}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border border-border rounded-lg">
                    <CardHeader className="bg-muted text-card-foreground p-4 border border-border rounded-t-lg">
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        {event.name}
                        {event.sport === 'basketball' && <TbBallBasketball className="h-5 w-5" />}
                        {event.sport === 'football' && <TbBallAmericanFootball className="h-5 w-5" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 bg-card border border-border rounded-b-lg">
                      <p className="text-muted-foreground mt-2 flex items-center"><Calendar className="mr-2 h-4 w-4" /> {formatDate(event.date)}</p>
                      <p className="text-muted-foreground mt-2 flex items-center"><TbBuildingStadium className='mr-2 h-4 w-4' />{event.venue}</p>
                      <p className="text-muted-foreground mt-2 flex items-center"><TbTicket className="mr-2 h-4 w-4" /> {availableTickets.length}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {!isLoading && filteredEvents.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">No events found.</p>
        )}
      </div>
    </div>
  )
}

export default isAuth(BrowseEventsPage);