import { CalendarDays, MapPin, Pencil, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { places } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { DeletePlaceButton } from "@/components/places/delete-place-button";
import { RatingDisplay } from "@/components/places/rating-display";

type Place = typeof places.$inferSelect;

type PlaceCardProps = {
  place: Place;
  currentUserId?: string | null;
};

function formatDate(value: Date | string | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function PlaceCard({ place, currentUserId }: PlaceCardProps) {
  const isOwner = currentUserId === place.userId;
  const visitedDate = formatDate(place.visitedDate);

  return (
    <article className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:border-primary/30 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-normal">
                <Link href={`/places/${place.id}`} className="hover:underline">
                  {place.name}
                </Link>
              </h2>
              <RatingDisplay rating={place.rating} className="mt-1" />
            </div>
          </div>

          {place.note ? (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {place.note}
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center">
            {place.address ? (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{place.address}</span>
              </span>
            ) : null}
            {visitedDate ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                Visited {visitedDate}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/places/${place.id}`}>
              <ExternalLink data-icon="inline-start" />
              Detail
            </Link>
          </Button>
          {isOwner ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/places/${place.id}/edit`}>
                  <Pencil data-icon="inline-start" />
                  Edit
                </Link>
              </Button>
              <DeletePlaceButton placeId={place.id} />
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
