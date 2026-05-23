import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePlace } from "@/lib/actions/places";

type DeletePlaceButtonProps = {
  placeId: string;
};

export function DeletePlaceButton({ placeId }: DeletePlaceButtonProps) {
  const action = deletePlace.bind(null, placeId);

  return (
    <form action={action}>
      <Button type="submit" variant="destructive" size="sm">
        <Trash2 data-icon="inline-start" />
        Delete
      </Button>
    </form>
  );
}
