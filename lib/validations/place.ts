import { z } from "zod";

export const placeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.coerce.number().int().min(1).max(5),
  note: z.string().optional(),
  address: z.string().optional(),
  visitedDate: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export type PlaceInput = z.infer<typeof placeSchema>;

export function validatePlace(data: unknown) {
  return placeSchema.safeParse(data);
}

export function validatePlaceCreate(data: unknown) {
  return placeSchema.safeParse(data);
}

export function validatePlaceUpdate(data: unknown) {
  return placeSchema.partial().safeParse(data);
}
