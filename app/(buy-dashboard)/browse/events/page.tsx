'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  TbBallBasketball, 
  TbBallAmericanFootball, 
  TbTicket, 
  TbBuildingStadium, 
  TbCalendarEvent, 
  TbSearch, 
  TbFilter 
} from "react-icons/tb"
import isAuth from '@/components/isAuth'
import pb from '@/app/pocketbase'
import { RecordModel } from 'pocketbase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
  const router = useRouter();

  // fetch events
  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push(`/login?redirect=${encodeURIComponent("/browse/events")}`);
    }

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
  }, [router]);

  const filteredEvents = events.filter(event =>
    (selectedSport === 'all' || event.sport === selectedSport) &&
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sportBadge = (sport: string) => {
    if (sport === 'basketball') {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <TbBallBasketball className="h-3 w-3" />
          <span>Basketball</span>
        </Badge>
      )
    } else if (sport === 'football') {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <TbBallAmericanFootball className="h-3 w-3" />
          <span>Football</span>
        </Badge>
      )
    }
    return null;
  }

  const SkeletonCard = () => (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border rounded-lg h-64">
      <div className="h-1/2 bg-muted animate-pulse" />
      <CardContent className="p-5">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-10 mb-8 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Student Events</h1>
          <p className="text-muted-foreground text-lg">Browse and purchase tickets for upcoming sports events</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        {/* Search and Filter Section */}
        <div className="mb-10 bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-1/3">
              <TbSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-10 bg-background border-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-sm font-medium text-muted-foreground mr-2">
                <TbFilter className="inline h-4 w-4 mr-1" />
                Filter:
              </span>
              <div className="flex space-x-2">
                <Toggle
                  pressed={selectedSport === 'all'}
                  onPressedChange={() => setSelectedSport('all')}
                  className={`bg-background text-foreground border border-border hover:bg-secondary/20 ${selectedSport === 'all' ? 'bg-secondary/20 border-primary/50' : ''}`}
                >
                  All Events
                </Toggle>
                <Toggle
                  pressed={selectedSport === 'basketball'}
                  onPressedChange={() => setSelectedSport('basketball')}
                  className={`bg-background text-foreground border border-border hover:bg-secondary/20 ${selectedSport === 'basketball' ? 'bg-secondary/20 border-primary/50' : ''}`}
                >
                  <TbBallBasketball className="mr-2 h-4 w-4" />
                  Basketball
                </Toggle>
                <Toggle
                  pressed={selectedSport === 'football'}
                  onPressedChange={() => setSelectedSport('football')}
                  className={`bg-background text-foreground border border-border hover:bg-secondary/20 ${selectedSport === 'football' ? 'bg-secondary/20 border-primary/50' : ''}`}
                >
                  <TbBallAmericanFootball className="mr-2 h-4 w-4" />
                  Football
                </Toggle>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">
            {isLoading ? 
              'Loading events...' : 
              `${filteredEvents.length} ${selectedSport !== 'all' ? selectedSport : ''} event${filteredEvents.length !== 1 ? 's' : ''} found`
            }
          </h2>
          {!isLoading && filteredEvents.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing events from {new Date(filteredEvents[0].date).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              // Filter out tickets from the current user and sold tickets
              const availableTickets = event.expand?.tickets.filter((ticket: { seller_id: string, status: string }) => 
                ticket.seller_id !== pb.authStore.model?.id && ticket.status !== 'sold'
              ) || [];
              
              // Calculate days until event
              const eventDate = new Date(event.date);
              const today = new Date();
              const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Link href={`/browse/events/${event.id}`} key={event.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group border border-border rounded-lg bg-card">
                    {/* Event image based on sport */}
                    <div className="h-32 relative p-5">
                      <Image
                        src={event.sport === 'basketball' ? '/images/rupp-arena.jpg' : '/images/kroger_field.webp'}
                        alt={event.sport === 'basketball' ? 'Kentucky Basketball' : 'UK Football'}
                        fill
                        className={`object-cover ${event.sport === 'basketball' ? 'object-[0_-120px]' : 'object-[0_-40px]'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {/* Sport badge */}
                      <div className="absolute top-4 right-4">
                        {sportBadge(event.sport)}
                      </div>
                      
                      {/* Event coming soon badge */}
                      {daysUntil <= 7 && daysUntil >= 0 && (
                        <Badge variant="secondary" className="absolute bottom-4 left-4 bg-primary/20 text-white">
                          {daysUntil === 0 ? 'Today' : `${daysUntil} day${daysUntil === 1 ? '' : 's'} away`}
                        </Badge>
                      )}
                      
                      {/* Event icon */}
                      <div className="absolute bottom-0 right-6 transform translate-y-1/2 bg-background p-2 rounded-full border border-border shadow-sm">
                        {event.sport === 'basketball' ? 
                          <TbBallBasketball className="h-8 w-8 text-[#BA4A00]" /> : 
                          <TbBallAmericanFootball className="h-8 w-8 text-[#27AE60]" />
                        }
                      </div>
                    </div>
                    
                    <CardContent className="p-5 pt-6">
                      <CardTitle className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-200">
                        {event.name}
                      </CardTitle>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <TbCalendarEvent className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          <span>{formatDate(event.date)}</span>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <TbBuildingStadium className="mr-2 h-4 w-4 flex-shrink-0" /> 
                          <span>{event.venue}</span>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-muted-foreground">
                            <TbTicket className="mr-2 h-4 w-4" /> 
                            <span>{availableTickets.length} tickets available</span>
                          </div>
                          <Badge variant="outline" className="border-primary/50 text-primary">
                            View
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center p-12 border border-dashed border-border rounded-lg bg-card/50">
            <TbTicket className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground">Try changing your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default isAuth(BrowseEventsPage);