"use client";

import Link from "next/link";
import { format } from "date-fns";

// Example event type
type Event = {
  id: string;
  name: string;
  date: Date;
  description: string;
  registrationLink: string;
  isUpcoming: boolean;
  isCommunityEvent: boolean;
};

// Mock events data (replace with your real data source, e.g., API/DB)
const events: Event[] = [
  {
    id: "1",
    name: "Ship in an hour (#1)",
    date: new Date(2025, 7, 2), // August 2, 2025
    description: "Join our open-source sprint! Build a fun project, share on GitHub, and win badges.",
    registrationLink: "https://github.com/orgs/func-Kode/discussions/19",
    isUpcoming: true,
    isCommunityEvent: true,
  },
  // Add more events as needed
];

export default function EventsPage() {
  const upcomingEvents = events.filter((e) => e.isUpcoming);
  const pastEvents = events.filter((e) => !e.isUpcoming);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Events</h1>
        <p className="text-lg text-gray-600">
          Build, learn, and ship together with the func(Kode) community.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-blue-700">{event.name}</h3>
                <p className="text-gray-600 mt-1 mb-3">
                  {format(event.date, "MMMM d, yyyy")}
                </p>
                <p className="mt-2 mb-4">{event.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={event.registrationLink}
                    target="_blank"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Register on GitHub
                  </Link>
                  <Link
                    href="/"
                    className="px-4 py-2 border hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events right now. Check back soon!</p>
        )}
      </section>

      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">{event.name}</h3>
                <p className="text-sm text-gray-600">
                  {format(event.date, "MMMM d, yyyy")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 border-t pt-6 text-center">
        <h3>Interested in hosting your own event?</h3>
        <Link
          href="https://github.com/orgs/func-Kode/discussions/categories/ideas-brainstorming"
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          Propose an event on GitHub Discussions
        </Link>
      </section>
    </div>
  );
}
