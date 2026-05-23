import type { places } from "@/db/schema";
import { PlaceCard } from "@/components/places/place-card";

type Place = typeof places.$inferSelect;

type PlaceListProps = {
  places: Place[];
  currentUserId?: string | null;
};

export function PlaceList({ places, currentUserId }: PlaceListProps) {
  return (
    <div className="grid gap-3 sm:gap-4">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
