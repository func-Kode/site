"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin } from "lucide-react";

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  long_description: string;
  location: string;
  max_attendees: number;
  tags: string[];
  difficulty: string;
  event_type: string;
  prizes?: string[];
  attendees?: number;
};

export default function EventPage() {
  const params = useParams();
  const eventId = params.id;

  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEventData = useCallback(async () => {
    if (!eventId) return;

    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        return;
      }

      setEventData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);


  if (loading || !eventData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="p-6 shadow-xl">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{eventData.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Calendar className="w-5 h-5" />
              <span>{new Date(eventData.date).toLocaleDateString()} at {eventData.time}</span>
              <MapPin className="w-5 h-5 ml-4" />
              <span>{eventData.location}</span>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed text-center">{eventData.long_description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {eventData.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            {eventData.prizes && (
              <div className="bg-muted/50 rounded-lg p-4 mt-4 w-full">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-green" />
                  Prizes & Rewards
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {eventData.prizes.map((prize, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-green rounded-full"></span>
                      {prize}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm mt-4">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{eventData.attendees || 0}/{eventData.max_attendees} attendees</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-brand-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${((eventData.attendees || 0) / eventData.max_attendees) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
